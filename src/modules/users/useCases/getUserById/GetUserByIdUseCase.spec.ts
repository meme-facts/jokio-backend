import { User } from "@modules/users/infra/typeorm/entities/Users";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { ResponseStatus } from "@shared/enums/StatusEnum";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "../requestUserToFollow/RequestUserToFollowUseCase";
import { GetUserByIdUseCase } from "./GetUserByIdUseCase";

let userRepositoryInMemory: IUserRepository;
let followerRepositoryInMemory: IFollowersRepository;
let createUserUseCase: CreateUserUseCase;
let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let getUserByIdUseCase: GetUserByIdUseCase;
let user1: User;
let user2: User;
describe("GetUserByIdUseCase", () => {
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

    const seccondUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva`,
      nickname: `Silvon2`,
      email: `silva@test2e.com`,
      password: "1234",
    });
    user1 = firstUserTest.user;
    user2 = seccondUserTest.user;
    await requestUserToFollowUseCase.execute(user2.id, user1.id);
    getUserByIdUseCase = new GetUserByIdUseCase(
      userRepositoryInMemory,
      followerRepositoryInMemory
    );
  });

  it("should be able to get user results by id", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserId: user2.id,
    });
    expect(user).toHaveProperty("id");
  });

  it("should be able to get users followers and following quantity", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserId: user2.id,
    });
    expect(user).toHaveProperty("followersQuantity");
    expect(user).toHaveProperty("followingQuantity");
  });

  it("should return follower relation when logged user is different of requested user", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserId: user2.id,
    });
    expect(user).toHaveProperty("relationStatus");
  });
  it("should return follower relation as 'UNKNOWN' when logged users do not follow requestedUser", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user2.id,
      requestedUserId: user1.id,
    });
    expect(user.relationStatus).toBe(ResponseStatus.UNKNOWN);
  });
  it("should return follower relation as 'OWNER' when logged users is same as requestedUser", async () => {
    const user = await getUserByIdUseCase.execute({
      loggedUserId: user1.id,
      requestedUserId: user1.id,
    });
    expect(user.relationStatus).toBe(ResponseStatus.OWNER);
  });
  it("should return error when requested user does not exist", async () => {
    await expect(
      getUserByIdUseCase.execute({
        loggedUserId: user1.id,
        requestedUserId: "wrong_user_id",
      })
    ).rejects.toEqual(new AppError("This users does not exist"));
  });
  //
});
