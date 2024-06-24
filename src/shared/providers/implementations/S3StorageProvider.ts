import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import { getType } from "mime";
import { resolve } from "path";

import upload from "../../../config/upload";

import { IStorageProvider } from "../IStorageProvider";

export class S3StorageProvider implements IStorageProvider {
  private cliente: S3;
  constructor() {
    this.cliente = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }
  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);
    const fileContent = await fs.promises.readFile(originalName);
    const ContentType = getType(originalName);
    await this.cliente.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key: `${folder}/${file}`,
      ACL: "public-read",
      Body: fileContent,
      ContentType,
    });
    await fs.promises.unlink(originalName);
    return file;
  }
  async delete(file: string, folder: string): Promise<void> {
    await this.cliente.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: `${folder}/${file}`,
    });
  }
}
