import { UserEntity } from "@modules/users/entities/User";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "../requestUserToFollow/RequestUserToFollowUseCase";
import { RemoveRelationUseCase } from "./RemoveRelationUseCase";

let userRepository: IUserRepository;
let followerRepository: IFollowersRepository;
let createUserUseCase: CreateUserUseCase;
let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let removeRelationUseCase: RemoveRelationUseCase;
let user1: UserEntity;
let user2: UserEntity;

describe("RemoveRelationUseCase", () => {
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
      full_name: `Teste da Silva`,
      nickname: `Silvon2`,
      email: `silva@test2e.com`,
      password: "1234",
    });
    user1 = firstUserTest.user;
    user2 = secondUserTest.user;
    await requestUserToFollowUseCase.execute({
      requestedUserId: firstUserTest.user.id,
      requesterUserId: secondUserTest.user.id,
    });
    removeRelationUseCase = new RemoveRelationUseCase(followerRepository);
  });

  it("should remove a relations between users when call the service.", async () => {
    await removeRelationUseCase.execute({
      requestedUserId: user1.id,
      requesterUserId: user2.id,
    });
    const relations = await followerRepository.getAll();
    expect(relations.length).toBe(0);
  });

  it("should not be able to remove the relation if relation is not found", async () => {
    await expect(
      removeRelationUseCase.execute({
        requestedUserId: user1.id,
        requesterUserId: "wrong_id",
      })
    ).rejects.toEqual(new AppError("Relation not found.", 404));
  });
});
