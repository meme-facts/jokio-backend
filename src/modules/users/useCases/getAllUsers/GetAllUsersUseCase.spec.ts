import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { GetAllUsersUseCase } from "./GetAllUsersUseCase";

let userRepository: IUserRepository;
let getAllUsersUseCase: GetAllUsersUseCase;
let createUserUseCase: CreateUserUseCase;
let logged_user_id: string;
describe("GetAllUsersUseCase", () => {
  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository);

    for (let i = 0; i < 12; i++) {
      await createUserUseCase.execute({
        full_name: `Teste da Silva${i + 1}`,
        nickname: `Silvon${i + 1}`,
        email: `silva@teste.com${i + 1}`,
        password: "1234",
      });
    }
    logged_user_id = (
      await createUserUseCase.execute({
        full_name: `Teste da Silva`,
        nickname: `Silvon`,
        email: `silva@teste.com`,
        password: "1234",
      })
    ).user.id;
  });

  it("should return user when send a part of user full_name", async () => {
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "Teste",
      logged_user_id,
    });
    expect(results.users[0].full_name).toEqual("Teste da Silva1");
    expect(results.users[1].full_name).toEqual("Teste da Silva2");
  });
  it("should return user when send a part of user nickname", async () => {
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "Silvon",
      logged_user_id,
    });
    expect(results.users[0].full_name).toEqual("Teste da Silva1");
    expect(results.users[1].full_name).toEqual("Teste da Silva2");
  });
  it("should return 10 items when page = 1 and limit = 10 and there is no filter and count = 12 (without logged_user) ", async () => {
    const results = await getAllUsersUseCase.execute({
      page: 1,
      logged_user_id,
    });
    expect(results.users.length).toBe(10);
    expect(results.count).toBe(12);
  });

  it("should return an empty array when no users match user_reference", async () => {
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "wrong_ref",
      logged_user_id,
    });
    expect(results.users.length).toBe(0);
    expect(results.count).toBe(0);
  });
});
