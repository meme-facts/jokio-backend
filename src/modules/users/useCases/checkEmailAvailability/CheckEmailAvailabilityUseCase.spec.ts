import { IUserRepository } from "@modules/users/repositories/IUserRepository";

import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CheckEmailAvailabilityUseCase } from "./CheckEmailAvailabilityUseCase";
import { randomUUID } from "crypto";

describe("CheckEmailAvailabilityUseCase", () => {
  let userRepository: IUserRepository;
  let checkEmailAvailabilityUseCase: CheckEmailAvailabilityUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    checkEmailAvailabilityUseCase = new CheckEmailAvailabilityUseCase(
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
    const response = await checkEmailAvailabilityUseCase.execute({
      email: user.email,
      loggedUserId: randomUUID(),
    });
    expect(response).toBe(false);
  });
  it("should return true if user exist and it is same id as logged user", async () => {
    const user = await userRepository.create({
      full_name: "Teste da Silva",
      nickname: "Silva",
      email: "silva@teste.com",
      password: "1234",
      isPrivate: false,
      img_url: "teste.com",
    });
    const response = await checkEmailAvailabilityUseCase.execute({
      email: user.email,
      loggedUserId: user.id,
    });
    expect(response).toBe(true);
  });
  it("should return true if user does not exist", async () => {
    const response = await checkEmailAvailabilityUseCase.execute({
      email: "test",
      loggedUserId: randomUUID(),
    });
    expect(response).toBe(true);
  });
});
