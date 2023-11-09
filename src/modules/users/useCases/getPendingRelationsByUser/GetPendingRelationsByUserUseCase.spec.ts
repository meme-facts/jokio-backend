import { StatusEnum } from "@modules/posts/enums/StatusEnum";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";

import { UserEntity } from "@modules/users/entities/User";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "../requestUserToFollow/RequestUserToFollowUseCase";
import { UpdateFollowerStatusUseCase } from "../updateFollowerStatus/UpdateFollowerStatusUseCase";
import { GetPendingRelationsByUserUseCase } from "./GetPendingRelationsByUserUseCase";

let userRepository: IUserRepository;
let followerRepository: IFollowersRepository;
let createUserUseCase: CreateUserUseCase;
let getAllPendingRelationsByUserId: GetPendingRelationsByUserUseCase;
let updateFollowerStatusUseCase: UpdateFollowerStatusUseCase;

let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let user1: UserEntity;
let user2: UserEntity;
let user3: UserEntity;
let user4: UserEntity;
describe("UpdateFollowerStatusUseCase", () => {
  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    followerRepository = new FollowersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    requestUserToFollowUseCase = new RequestUserToFollowUseCase(
      followerRepository,
      userRepository
    );

    const firstUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva`,
      nickname: `Silvon`,
      email: `silva@teste.com`,
      password: "1234",
    });

    const secondUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva2`,
      nickname: `Silvon2`,
      email: `silva2@test2e.com`,
      password: "1234",
      isPrivate: true,
    });
    const thirdUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva3`,
      nickname: `Silvon3`,
      email: `silva3@test2e.com`,
      password: "1234",
      isPrivate: true,
    });
    const fourthUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva3`,
      nickname: `Silvon4`,
      email: `silva4@test2e.com`,
      password: "1234",
      isPrivate: true,
    });
    user1 = firstUserTest.user;
    user2 = secondUserTest.user;
    user3 = thirdUserTest.user;
    user4 = fourthUserTest.user;
    await requestUserToFollowUseCase.execute(
      secondUserTest.user.id,
      firstUserTest.user.id
    );
    await requestUserToFollowUseCase.execute(
      secondUserTest.user.id,
      thirdUserTest.user.id
    );
    await requestUserToFollowUseCase.execute(
      thirdUserTest.user.id,
      secondUserTest.user.id
    );
    await requestUserToFollowUseCase.execute(
      firstUserTest.user.id,
      thirdUserTest.user.id
    );
    await requestUserToFollowUseCase.execute(
      secondUserTest.user.id,
      fourthUserTest.user.id
    );
    updateFollowerStatusUseCase = new UpdateFollowerStatusUseCase(
      followerRepository
    );
    await updateFollowerStatusUseCase.execute({
      fStatus: StatusEnum.Accepted,
      requestedUserId: user3.id,
      requesterUserId: user2.id,
    });

    getAllPendingRelationsByUserId = new GetPendingRelationsByUserUseCase(
      followerRepository,
      userRepository
    );
  });

  it("should return all relations by user id", async () => {
    const relations = await getAllPendingRelationsByUserId.execute({
      page: 1,
      limit: 5,
      userId: user2.id,
    });
    expect(relations.count).toBe(3);
  });

  it("should not return relations that status is not P", async () => {
    const relations = await getAllPendingRelationsByUserId.execute({
      page: 1,
      limit: 5,
      userId: user3.id,
    });
    expect(relations.count).toBe(0);
  });
  it("should not be able to return data when user is a private users", async () => {
    await expect(
      getAllPendingRelationsByUserId.execute({
        page: 1,
        limit: 5,
        userId: user1.id,
      })
    ).rejects.toEqual(
      new AppError("Public users do not receive friend request.")
    );
  });
  it("should not return relations that status is not P", async () => {
    const page1 = await getAllPendingRelationsByUserId.execute({
      page: 1,
      limit: 2,
      userId: user2.id,
    });

    const page2 = await getAllPendingRelationsByUserId.execute({
      page: 2,
      limit: 2,
      userId: user2.id,
    });
    expect(page1.count).toBe(3);
    expect(page1.requests.length).toBe(2);
    expect(page2.count).toBe(3);
    expect(page2.requests.length).toBe(1);
  });
});
