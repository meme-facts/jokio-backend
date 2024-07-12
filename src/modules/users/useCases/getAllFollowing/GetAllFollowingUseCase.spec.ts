import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { GetAllFollowingUseCase } from "./GetAllFollowingUseCase";

let userRepository: IUserRepository;
let getAllUsersUseCase: GetAllFollowingUseCase;
let createUserUseCase: CreateUserUseCase;
let followersRepository: IFollowersRepository;
let user1: UserDto;
let user2: UserDto;
describe("GetAllFollowingUseCase", () => {
  beforeEach(async () => {
    followersRepository = new FollowersRepositoryInMemory();
    userRepository = new UserRepositoryInMemory(followersRepository);
    getAllUsersUseCase = new GetAllFollowingUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository);
    user1 = (
      await createUserUseCase.execute({
        full_name: `Teste da Silva`,
        nickname: `user1`,
        email: `silva@teste.com`,
        password: "1234",
      })
    ).user;
    user2 = (
      await createUserUseCase.execute({
        full_name: `User 2 Silva`,
        nickname: `user2silva`,
        email: `silv@teste.com`,
        password: "1234",
      })
    ).user;
    for (let i = 0; i < 12; i++) {
      await createUserUseCase.execute({
        full_name: `Teste da Silva${i + 1}`,
        nickname: `Silvon${i + 1}`,
        email: `silva@teste.com${i + 1}`,
        password: "1234",
      });
    }
  });

  it("should return user when send a part of user full_name", async () => {
    await followersRepository.create({
      requesterUserId: user1.id,
      requestedUserId: user2.id,
    });
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "User 2",
      following_id: user1.id,
    });
    console.log(results);

    expect(results.users[0].full_name).toEqual("User 2 Silva");
  });
  it("should return user when send a part of user nickname", async () => {
    await followersRepository.create({
      requesterUserId: user1.id,
      requestedUserId: user2.id,
    });
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit: 10,
      user_reference: "user2",
      following_id: user1.id,
    });
    console.log(results);

    expect(results.users[0].nickname).toEqual("user2silva");
  });

  it("should return all following users paginated when do not give user_reference", async () => {
    const users = await userRepository.getAllById(user1.id);
    const limit = 10;

    await users.map(
      async (user) =>
        await followersRepository.create({
          requesterUserId: user1.id,
          requestedUserId: user.id,
        })
    );

    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit,
      following_id: user1.id,
    });

    expect(results.count).toBe(users.length);
    expect(results.users.length).toBe(limit);
  });
  it("should return [] when user have no following", async () => {
    const limit = 10;
    const results = await getAllUsersUseCase.execute({
      page: 1,
      limit,
      following_id: user1.id,
    });

    expect(results.count).toBe(0);
    expect(results.users.length).toBe(0);
  });
});
