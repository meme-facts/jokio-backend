import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "../../repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "../../repositories/IUserRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

let userRepositoryInMemory: IUserRepository;
let createUserUseCase: CreateUserUseCase;
let updateUserUseCase: UpdateUserUseCase;
let user: User;
describe("UpdateUserUseCase", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    updateUserUseCase = new UpdateUserUseCase(userRepositoryInMemory);
    const response = await createUserUseCase.execute({
      full_name: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
      password: "1234",
    });
    user = response.user;
  });

  it("should update an user", async () => {
    const newUser = new User();
    Object.assign(newUser, {
      id: user.id,
      full_name: "Teste da Silva atualizar",
      nickname: "Silva",
      email: "update@test.ui",
    });
    const updatedUser = await updateUserUseCase.execute(newUser);
    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.email).toBe("update@test.ui");
  });
  it("should return an error when user do not exist", async () => {
    const newUser = new User();
    Object.assign(newUser, {
      id: "wrong_id",
      full_name: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
    });
    await expect(async () => {
      await updateUserUseCase.execute(newUser);
    }).rejects.toBeInstanceOf(AppError);
    await expect(async () => {
      await updateUserUseCase.execute(newUser);
    }).rejects.toThrowError("User not found.");
  });
});
