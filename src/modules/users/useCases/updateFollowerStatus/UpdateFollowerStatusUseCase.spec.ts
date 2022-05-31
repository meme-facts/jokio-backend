import { User } from "@modules/users/infra/typeorm/entities/Users";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { StatusEnum } from "@shared/enums/StatusEnum";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "../requestUserToFollow/RequestUserToFollowUseCase";
import { UpdateFollowerStatusUseCase } from "./UpdateFollowerStatusUseCase";

let userRepository: IUserRepository;
let followerRepository: IFollowersRepository;
let createUserUseCase: CreateUserUseCase;
let updateFollowerStatusUseCase: UpdateFollowerStatusUseCase;
let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let user1: User;
let user2: User;
describe("UpdateFollowerStatusUseCase", () => {
  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    followerRepository = new FollowersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    requestUserToFollowUseCase = new RequestUserToFollowUseCase(
      followerRepository,
      userRepository
    );
    updateFollowerStatusUseCase = new UpdateFollowerStatusUseCase(
      followerRepository
    );
    const firstUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva`,
      nickname: `Silvon`,
      email: `silva@teste.com`,
      password: "1234",
    });

    const seccondUserTest = await createUserUseCase.execute({
      full_name: `Teste da Silva`,
      nickname: `Silvon2`,
      email: `silva@test2e.com`,
      password: "1234",
    });
    user1 = firstUserTest.user;
    user2 = seccondUserTest.user;
    await requestUserToFollowUseCase.execute(
      firstUserTest.user.id,
      seccondUserTest.user.id
    );
  });

  it("should change fStatus to A when pass A by query param", async () => {
    await updateFollowerStatusUseCase.execute({
      fStatus: StatusEnum.Accepted,
      requestedUserId: user1.id,
      requesterUserId: user2.id,
    });

    const relation = await followerRepository.getSolicitation(
      user1.id,
      user2.id
    );
    expect(relation.fStatus).toBe(StatusEnum.Accepted);
  });

  it("should change fStatus to B when pass B by query param", async () => {
    await updateFollowerStatusUseCase.execute({
      fStatus: StatusEnum.Blocked,
      requestedUserId: user1.id,
      requesterUserId: user2.id,
    });

    const relation = await followerRepository.getSolicitation(
      user1.id,
      user2.id
    );
    expect(relation.fStatus).toBe(StatusEnum.Blocked);
  });

  it("should not be able to update a solicitation if the users doesn't exists.", async () => {
    await expect(
      updateFollowerStatusUseCase.execute({
        fStatus: StatusEnum.Blocked,
        requestedUserId: user1.id,
        requesterUserId: "wrong_id",
      })
    ).rejects.toEqual(new AppError("Relation not found", 404));
  });
});
