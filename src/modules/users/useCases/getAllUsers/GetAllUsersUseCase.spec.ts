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
for (let i = 0; i < 12; i++) {
  await createUserUseCase.execute({
    full_name: `Teste da Silva${i+1}`,
    nickname: `Silvon${i+1}`,
    email: `silva@teste.com${i+1}`,
    password: "1234",
  });
  
}
  });

  it("should return user when send a part of user full_name", async () => {
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "Teste"
    });
    expect(results.users[0].full_name).toEqual("Teste da Silva1");
    expect(results.users[1].full_name).toEqual("Teste da Silva2");
  });
  it("should return user when send a part of user nickname", async () => {
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "Silvon"
    });
    expect(results.users[0].full_name).toEqual("Teste da Silva1");
    expect(results.users[1].full_name).toEqual("Teste da Silva2");
  });
  it("should return 10 items when page = 1 and limit = 10 and there is no filter and count = 12 ", async () => {
    const results = await getAllUsersUseCase.execute({
      page: 1,
    });
    expect(results.users.length).toBe(10);
    expect(results.count).toBe(12);
  });

  it('should return error with the message: "user not found" when user was not match on repository', async () => {
    await expect(async () => {
     await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "dwadwadwadawdwa"
    });
    }).rejects.toBeInstanceOf(AppError);
    await expect(async () => {
     await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "dwadwadwadawdwa"
    });
    }).rejects.toThrowError("User not found.");
  });
});
