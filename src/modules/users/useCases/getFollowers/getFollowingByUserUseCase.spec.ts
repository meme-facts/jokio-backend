import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";

import { UserEntity } from "@modules/users/entities/User";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "../requestUserToFollow/RequestUserToFollowUseCase";
import { GetFollowersByUserUseCase } from "./getFollowersByUserUseCase";
let getFollowersUseCase: GetFollowersByUserUseCase;
let followerRepository: IFollowersRepository;
let userRepository: IUserRepository;
let createUserUseCase: CreateUserUseCase;
let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let followed: UserEntity;
let following1: UserEntity;
let following2: UserEntity;
describe("GetFollowersByUserUseCase", () => {
  beforeEach(async () => {
    followerRepository = new FollowersRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    getFollowersUseCase = new GetFollowersByUserUseCase(
      followerRepository,
      userRepository
    );
    requestUserToFollowUseCase = new RequestUserToFollowUseCase(
      followerRepository,
      userRepository
    );
    followed = (
      await createUserUseCase.execute({
        full_name: "Teste da Silva1",
        nickname: "Silvon1",
        email: "teste@sova.com",
        password: "1234",
      })
    ).user;
    following1 = (
      await createUserUseCase.execute({
        full_name: "Teste da Silva2",
        nickname: "Silvon2",
        email: "teste@teste.com",
        password: "1234",
      })
    ).user;
    following2 = (
      await createUserUseCase.execute({
        full_name: "Teste da Silva3",
        nickname: "Silvon3",
        email: "teste@testeteste.com",
        password: "1234",
      })
    ).user;
  });
  it("should return a list of follower users", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed.id,
      requesterUserId: following1.id,
    });

    await requestUserToFollowUseCase.execute({
      requestedUserId: followed.id,
      requesterUserId: following2.id,
    });
    const followers = await getFollowersUseCase.execute({
      userId: followed.id,
      page: 1,
    });
    expect(followers.count).toBe(2);
    expect(followers.followers.length).toBe(2);
  });
  it("should return a list of followers users sorted by created_at as default", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed.id,
      requesterUserId: following1.id,
    });

    await requestUserToFollowUseCase.execute({
      requestedUserId: followed.id,
      requesterUserId: following2.id,
    });
    const followers = await getFollowersUseCase.execute({
      userId: followed.id,
      page: 1,
    });
    expect(followers.followers[0].requesterUserId).toBe(following1.id);
  });
  it("should return a list of following users paginated", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed.id,
      requesterUserId: following1.id,
    });

    await requestUserToFollowUseCase.execute({
      requestedUserId: followed.id,
      requesterUserId: following2.id,
    });
    const followers = await getFollowersUseCase.execute({
      userId: followed.id,
      page: 1,
      limit: 1,
    });
    expect(followers.followers.length).toBe(1);
    expect(followers.count).toBe(2);
  });
  it("should throw an error if sort by is invalid", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: following1.id,
      requesterUserId: followed.id,
    });

    await requestUserToFollowUseCase.execute({
      requestedUserId: following2.id,
      requesterUserId: followed.id,
    });
    await expect(
      getFollowersUseCase.execute({
        userId: followed.id,
        page: 1,
        limit: 1,
        sortBy: "invalid",
      })
    ).rejects.toThrow();
  });
  it("should throw an error if user does not exist", async () => {
    await expect(
      getFollowersUseCase.execute({
        userId: "invalid",
        page: 1,
        limit: 1,
      })
    ).rejects.toThrow();
  });
});
