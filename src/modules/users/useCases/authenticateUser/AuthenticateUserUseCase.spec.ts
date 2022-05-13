import { UserRepositoryInMemory } from "modules/users/repositories/InMemory/UserRepositoryInMemory";
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
      fullName: "Teste da Silva",
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
  // should not be able to receive token when email do not exist, and need to return "login or password incorrect"
  // should not be able to receive token when password is not correct, and need to return "login or password incorrect"
});
