import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { UserEntity } from "@modules/users/entities/User";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { MessageRepositoryInMemory } from "@modules/users/repositories/InMemory/MessageRepositoryInMemory";
import { GetConversationUseCase } from "./GetConversationUseCase";
import { CreateMessageUseCase } from "../createMessage/CreateMessageUserCase";

describe("GetConversationUseCase", () => {
  let createMessageUseCase: CreateMessageUseCase;
  let getConversationUseCase: GetConversationUseCase;
  let userRepository: IUserRepository;
  let messagesRepository: IMessagesRepository;
  let createUserUseCase: CreateUserUseCase;
  let user: UserDto;
  let user2: UserDto;

  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    messagesRepository = new MessageRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    getConversationUseCase = new GetConversationUseCase(
      userRepository,
      messagesRepository
    );
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
  it("should be able to get a conversation between two users", async () => {
    await createMessageUseCase.execute({
      fromUserId: user.id,
      message: "teste",
      toUserId: user2.id,
    });
    const conversation = await getConversationUseCase.execute({
      loggedUserId: user.id,
      targetUserId: user2.id,
      offset: 0,
      limit: 10,
    });
    expect(conversation.messagesBetweenUsers.length).toBe(1);
    expect(conversation.count).toBe(1);
  });
  it("should not be able to get a conversation if logged user not exists", async () => {
    await expect(
      getConversationUseCase.execute({
        loggedUserId: "wrongId",
        targetUserId: user2.id,
        offset: 0,
        limit: 10,
      })
    ).rejects.toThrow("Logged user not found");
  });
  it("should not be able to get a conversation if target user not exists", async () => {
    await expect(
      getConversationUseCase.execute({
        loggedUserId: user.id,
        targetUserId: "wrongId",
        offset: 0,
        limit: 10,
      })
    ).rejects.toThrow("User not found");
  });
});
