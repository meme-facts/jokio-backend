import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";

import { UserEntity } from "@modules/users/entities/User";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "../requestUserToFollow/RequestUserToFollowUseCase";
import { GetFollowingByUserUseCase } from "./getFollowingByUserUseCase";
let getFollowingUseCase: GetFollowingByUserUseCase;
let followerRepository: IFollowersRepository;
let userRepository: IUserRepository;
let createUserUseCase: CreateUserUseCase;
let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let following: UserEntity;
let followed1: UserEntity;
let followed2: UserEntity;
describe("GetFollowingByUserUseCase", () => {
  beforeEach(async () => {
    followerRepository = new FollowersRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    getFollowingUseCase = new GetFollowingByUserUseCase(
      followerRepository,
      userRepository
    );
    requestUserToFollowUseCase = new RequestUserToFollowUseCase(
      followerRepository,
      userRepository
    );
    following = (
      await createUserUseCase.execute({
        full_name: "Teste da Silva1",
        nickname: "Silvon1",
        email: "teste@sova.com",
        password: "1234",
      })
    ).user;
    followed1 = (
      await createUserUseCase.execute({
        full_name: "Teste da Silva2",
        nickname: "Silvon2",
        email: "teste@teste.com",
        password: "1234",
      })
    ).user;
    followed2 = (
      await createUserUseCase.execute({
        full_name: "Teste da Silva3",
        nickname: "Silvon3",
        email: "teste@testeteste.com",
        password: "1234",
      })
    ).user;
  });
  it("should return a list of following users", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed1.id,
      requesterUserId: following.id,
    });
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed2.id,
      requesterUserId: following.id,
    });
    const followingList = await getFollowingUseCase.execute({
      userId: following.id,
      page: 1,
    });
    expect(followingList.following.length).toBe(2);
  });
  it("should return a list of following users sorted by created_at as default", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed1.id,
      requesterUserId: following.id,
    });

    await requestUserToFollowUseCase.execute({
      requestedUserId: followed2.id,
      requesterUserId: following.id,
    });
    const followingList = await getFollowingUseCase.execute({
      userId: following.id,
      page: 1,
    });

    expect(followingList.following[0].requestedUserId).toBe(followed1.id);
  });
  it("should return a list of following users paginated", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed1.id,
      requesterUserId: following.id,
    });

    await requestUserToFollowUseCase.execute({
      requestedUserId: followed2.id,
      requesterUserId: following.id,
    });
    const followingList = await getFollowingUseCase.execute({
      userId: following.id,
      page: 1,
      limit: 1,
    });
    expect(followingList.following.length).toBe(1);
    expect(followingList.count).toBe(2);
  });
  it("should throw an error if sort by is invalid", async () => {
    await requestUserToFollowUseCase.execute({
      requestedUserId: followed1.id,
      requesterUserId: following.id,
    });

    await requestUserToFollowUseCase.execute({
      requestedUserId: followed2.id,
      requesterUserId: following.id,
    });
    await expect(
      getFollowingUseCase.execute({
        userId: following.id,
        page: 1,
        limit: 1,
        sortBy: "invalid",
      })
    ).rejects.toThrow();
  });
  it("should throw an error if user does not exist", async () => {
    await expect(
      getFollowingUseCase.execute({
        userId: "invalid",
        page: 1,
        limit: 1,
      })
    ).rejects.toThrow();
  });
});
