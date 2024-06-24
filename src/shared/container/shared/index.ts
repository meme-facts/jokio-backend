import { IStorageProvider } from "@shared/providers/IStorageProvider";
import { container } from "tsyringe";
import { ESharedInstances } from "./shared.enum";
import { S3StorageProvider } from "@shared/providers/implementations/S3StorageProvider";
import { LocalStorageProvider } from "@shared/providers/implementations/LocalStorageProvider";

const diskStorage = {
  test: LocalStorageProvider,
  prod: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  ESharedInstances.StorageProvider,
  diskStorage[process.env.NODE_ENV]
);
