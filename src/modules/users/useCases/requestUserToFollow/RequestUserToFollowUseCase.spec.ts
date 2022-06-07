import { User } from "@modules/users/infra/typeorm/entities/Users";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "./RequestUserToFollowUseCase";

let userRepositoryInMemory: IUserRepository;
let followerRepositoryInMemory: IFollowersRepository;
let createUserUseCase: CreateUserUseCase;
let requestUserToFollowUseCase: RequestUserToFollowUseCase;
let user1: User;
let user2: User;
describe("RequestUserToFollowUseCase", () => {
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
  });
  it("should request a user to follow", async () => {
    await requestUserToFollowUseCase.execute(user1.id, user2.id);
    const followers = await followerRepositoryInMemory.getAll();
    expect(followers[0]).toHaveProperty("id");
  });
  // should return error when some of users do not exist
  it("should return error when user do not exist", async () => {
    await expect(
      requestUserToFollowUseCase.execute("wrong_user_id", user2.id)
    ).rejects.toEqual(new AppError("This user does not exist!", 404));
  });
  it("fstatus should be P when user request a relation for a private user ", async () => {
    await requestUserToFollowUseCase.execute(user1.id, user2.id);
    const followers = await followerRepositoryInMemory.getAll();
    expect(followers[0].fStatus).toBe("P");
  });
  it("fstatus should be A when user request a relation for a non private user ", async () => {
    await requestUserToFollowUseCase.execute(user2.id, user1.id);
    const followers = await followerRepositoryInMemory.getAll();
    expect(followers[0].fStatus).toBe("A");
  });
  it("should not be able to create a solicitation if the users has already send a solicitation.", async () => {
    await requestUserToFollowUseCase.execute(user1.id, user2.id);
    await expect(
      requestUserToFollowUseCase.execute(user1.id, user2.id)
    ).rejects.toEqual(new AppError("Users can create only one solicitation!"));
  });
});
