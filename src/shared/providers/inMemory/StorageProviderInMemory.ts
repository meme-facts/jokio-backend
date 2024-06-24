import { IStorageProvider } from "../IStorageProvider";

export class StorageProviderInMemory implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    return file;
  }
  async delete(file: string, folder: string): Promise<void> {}
}
