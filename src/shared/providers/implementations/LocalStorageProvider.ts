import fs from "fs";
import { resolve } from "path";

import upload from "@config/upload";
import { removeFileFromPaths } from "@utils/removeFiles";

import { IStorageProvider } from "../IStorageProvider";

export class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    await fs.promises.rename(
      resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    );
    return file;
  }
  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${upload.tmpFolder}/${folder}`, file);
    await removeFileFromPaths(filename);
  }
}
