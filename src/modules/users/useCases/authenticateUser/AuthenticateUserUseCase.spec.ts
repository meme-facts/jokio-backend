import { AppError } from "../../../../shared/errors/AppError";
import { UserRepositoryInMemory } from "../../repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
describe("AuthenticateUserUseCase", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    await createUserUseCase.execute({
      full_name: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
      password: "1234",
    });
  });
  it("should return user and password when a created user send email or nickname and correct password", async () => {
    const success = await authenticateUserUseCase.execute({
      login: "silva@teste.com",
      password: "1234",
    });
    expect(success).toHaveProperty("user");
    expect(success).toHaveProperty("token");
  });

  it('should not be able to receive token when email do not exist, and need to return "login or password incorrect', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        login: "wrog_email",
        password: "opdiwaoidwa",
      });
    }).rejects.toThrowError("Login or password incorrect.");
    await expect(async () => {
      await authenticateUserUseCase.execute({
        login: "wrog_email",
        password: "opdiwaoidwa",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to receive token when password is not correct, and need to return "login or password incorrect', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        login: "silva@teste.com",
        password: "opdiwaoidwa",
      });
    }).rejects.toThrowError("Login or password incorrect.");
    await expect(async () => {
      await authenticateUserUseCase.execute({
        login: "silva@teste.com",
        password: "opdiwaoidwa",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
