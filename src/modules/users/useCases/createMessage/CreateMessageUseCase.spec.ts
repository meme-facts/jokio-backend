import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { UserEntity } from "@modules/users/entities/User";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { MessageRepositoryInMemory } from "@modules/users/repositories/InMemory/MessageRepositoryInMemory";
import { CreateMessageUseCase } from "./CreateMessageUserCase";

describe("GetConversationUseCase", () => {
  let createMessageUseCase: CreateMessageUseCase;
  let userRepository: IUserRepository;
  let messagesRepository: IMessagesRepository;
  let createUserUseCase: CreateUserUseCase;
  let user: UserDto;
  let user2: UserDto;

  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    messagesRepository = new MessageRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createMessageUseCase = new CreateMessageUseCase(
      messagesRepository,
      userRepository
    );
    user = (
      await createUserUseCase.execute({
        full_name: "opateste",
        nickname: "teste",
        email: "user.test@gmail.com",
        password: "12345678",
      })
    ).user;
    user2 = (
      await createUserUseCase.execute({
        full_name: "opateste",
        nickname: "teste2",
        email: "test.user.ui@gmail.com",
        password: "12345678",
      })
    ).user;
  });
  it("should be able to create a message", async () => {
    const message = await createMessageUseCase.execute({
      fromUserId: user.id,
      message: "teste",
      toUserId: user2.id,
    });
    expect(message).toHaveProperty("id");
  });
  it("should not be able to create a message if sender not exists", async () => {
    await expect(
      createMessageUseCase.execute({
        fromUserId: "wrongId",
        message: "teste",
        toUserId: user2.id,
      })
    ).rejects.toThrow("Logged user not found");
  });
  it("should not be able to create a message if receiver not exists", async () => {
    await expect(
      createMessageUseCase.execute({
        fromUserId: user.id,
        message: "teste",
        toUserId: "wrongId",
      })
    ).rejects.toThrow("User not found");
  });
});
