import { UserEntity } from "@modules/users/entities/User";
import { AppError } from "../../../../shared/errors/AppError";

import { IUserRepository } from "../../repositories/IUserRepository";
import { UserRepositoryInMemory } from "../../repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";
import { IStorageProvider } from "@shared/providers/IStorageProvider";
import { StorageProviderInMemory } from "@shared/providers/inMemory/StorageProviderInMemory";
import { isUrl } from "@utils/regex";

let userRepositoryInMemory: IUserRepository;
let createUserUseCase: CreateUserUseCase;
let updateUserAvatar: UpdateUserAvatarUseCase;
let user: UserEntity;
let storageProvider: IStorageProvider;
describe("UpdateUserUseCase", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    storageProvider = new StorageProviderInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    updateUserAvatar = new UpdateUserAvatarUseCase(
      userRepositoryInMemory,
      storageProvider
    );
    const response = await createUserUseCase.execute({
      full_name: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
      password: "1234",
    });
    user = response.user;
  });

  it("should update an user", async () => {
    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatar_file: "test",
    });

    expect(updatedUser.img_url).toMatch(isUrl);
  });
  it("should return an error when user do not exist", async () => {
    await expect(async () => {
      await updateUserAvatar.execute({
        user_id: "wrong_id",
        avatar_file: "test",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
