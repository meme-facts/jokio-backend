import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CheckUsernameAvailabilityUseCase } from "./CheckUsernameAvailabilityUseCase";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { randomUUID } from "crypto";

describe("CheckUserNameAvailabilityUseCase", () => {
  let userRepository: IUserRepository;
  let checkUsernameAvailabilityUseCase: CheckUsernameAvailabilityUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    checkUsernameAvailabilityUseCase = new CheckUsernameAvailabilityUseCase(
      userRepository
    );
  });
  it("should return false if user already exist", async () => {
    const user = await userRepository.create({
      full_name: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
      password: "1234",
      isPrivate: false,
      img_url: "teste.com",
    });
    const response = await checkUsernameAvailabilityUseCase.execute({
      nickname: user.nickname,
      loggedUserId: randomUUID(),
    });
    expect(response).toBe(false);
  });
  it("should return true if user exist but is same id as logged user", async () => {
    const user = await userRepository.create({
      full_name: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
      password: "1234",
      isPrivate: false,
      img_url: "teste.com",
    });
    const response = await checkUsernameAvailabilityUseCase.execute({
      nickname: user.nickname,
      loggedUserId: user.id,
    });
    expect(response).toBe(true);
  });
  it("should return true if user does not exist", async () => {
    const response = await checkUsernameAvailabilityUseCase.execute({
      nickname: "test",
      loggedUserId: randomUUID(),
    });
    expect(response).toBe(true);
  });
});
