import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { GetAllUsersUseCase } from "./GetAllUsersUseCase";

let userRepository: IUserRepository;
let getAllUsersUseCase: GetAllUsersUseCase;
let createUserUseCase: CreateUserUseCase;

describe("GetAllUsersUseCase", () => {
  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository);
    await createUserUseCase.execute({
      full_name: "Teste da Silva",
      nickname: "Silvon",
      email: "silva@teste.com",
      password: "1234",
    });
    await createUserUseCase.execute({
      full_name: "Teste da Silva2",
      nickname: "Silvon2",
      email: "silva2@teste.com",
      password: "1234",
    });
  });

  it("should return user when send a part of user full_name", async () => {
    const results = await getAllUsersUseCase.execute("Teste");
    console.log(results);
    expect(results[0].full_name).toEqual("Teste da Silva");
    expect(results[1].full_name).toEqual("Teste da Silva2");
  });
  it("should return user when send a part of user nickname", async () => {
    const results = await getAllUsersUseCase.execute("Silvon");
    console.log(results);
    expect(results[0].full_name).toEqual("Teste da Silva");
    expect(results[1].full_name).toEqual("Teste da Silva2");
  });
  it('should return error with the message: "user not found" when user was not match on repository', async () => {
    await expect(async () => {
      await getAllUsersUseCase.execute("dioawhdiohioaw");
    }).rejects.toBeInstanceOf(AppError);
    await expect(async () => {
      await getAllUsersUseCase.execute("dioawhdiohioaw");
    }).rejects.toThrowError("User not found.");
  });
});
