import { AppError } from "../../../../shared/errors/AppError";
import { UserRepositoryInMemory } from "../../repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
describe("CreateUserUseCase", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    await createUserUseCase.execute({
      fullName: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
      password: "1234",
    });
  });

  it("should create an user and return user & token", async () => {
    const user = await createUserUseCase.execute({
      fullName: "opateste",
      nickname: "tes",
      email: "test@teste.com",
      password: "1234",
    });
    expect(user).toHaveProperty("user");
    expect(user).toHaveProperty("token");
  });

  it("should not be able to create an user with a existent email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        fullName: "opateste",
        nickname: "teste2",
        email: "silva@teste.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to create an user with a existent nickname", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        fullName: "opateste",
        nickname: "Silva",
        email: "teste@teste.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
