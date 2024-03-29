import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";

import { UserEntity } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "../requestUserToFollow/RequestUserToFollowUseCase";
import { GetUserByNickNameUseCase } from "./GetUserByNickNameUseCase";

let userRepositoryInMemory: IUserRepository;
let followerRepositoryInMemory: IFollowersRepository;
let createUserUseCase: CreateUserUseCase;
let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let getUserByIdUseCase: GetUserByNickNameUseCase;
let user1: UserEntity;
let user2: UserEntity;
describe("GetUserByNickNameUseCase", () => {
  beforeEach(async () => {
    followerRepositoryInMemory = new FollowersRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    requestUserToFollowUseCase = new RequestUserToFollowUseCase(
      followerRepositoryInMemory,
      userRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    const firstUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva`,
      nickname: `Silvon`,
      email: `silva@teste.com`,
      password: "1234",
      isPrivate: true,
    });

    const secondUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva`,
      nickname: `Silvon2`,
      email: `silva@test2e.com`,
      password: "1234",
    });
    user1 = firstUserTest.user;
    user2 = secondUserTest.user;
    await requestUserToFollowUseCase.execute({
      requestedUserId: user2.id,
      requesterUserId: user1.id,
    });
    getUserByIdUseCase = new GetUserByNickNameUseCase(
      userRepositoryInMemory,
      followerRepositoryInMemory
    );
  });

  it("should be able to get user results by nickname", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserNickName: user2.nickname,
    });
    expect(user).toHaveProperty("id");
  });

  it("should be able to get users followers and following quantity", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserNickName: user2.nickname,
    });
    expect(user).toHaveProperty("followersQuantity");
    expect(user).toHaveProperty("followingQuantity");
  });

  it("should return follower relation when logged user is different of requested user", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserNickName: user2.nickname,
    });
    expect(user).toHaveProperty("relationStatus");
  });
  it("should return follower relation as 'UNKNOWN' when logged users do not follow requestedUser", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user2.id,
      requestedUserNickName: user1.nickname,
    });
    expect(user.relationStatus).toBe(FollowerStatusEnum.UNKNOWN);
  });
  it("should return follower relation as 'OWNER' when logged users is same as requestedUser", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserNickName: user1.nickname,
    });
    expect(user.relationStatus).toBe(FollowerStatusEnum.OWNER);
  });
  it("should return error when requested user does not exist", async () => {
    await expect(
      getUserByIdUseCase.execute({
        loggedUserId: user1.id,
        requestedUserNickName: "wrong_nickname",
      })
    ).rejects.toEqual(new AppError("This users does not exist"));
  });
});
