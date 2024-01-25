import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { MessageRepositoryInMemory } from "@modules/users/repositories/InMemory/MessageRepositoryInMemory";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateMessageUseCase } from "../createMessage/CreateMessageUserCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { GetAllConversationsUseCase } from "./GetAllConversationsUseCase";

describe("Get All Conversations", () => {
  let userRepository: IUserRepository;
  let messageRepository: IMessagesRepository;
  let getAllConversationsUseCase: GetAllConversationsUseCase;
  let createUserUseCase: CreateUserUseCase;
  let createMessageUseCase: CreateMessageUseCase;
  let user1: UserDto;
  let user2: UserDto;

  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    messageRepository = new MessageRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createMessageUseCase = new CreateMessageUseCase(
      messageRepository,
      userRepository
    );
    getAllConversationsUseCase = new GetAllConversationsUseCase(
      messageRepository,
      userRepository
    );
    user1 = (
      await createUserUseCase.execute({
        full_name: "opateste",
        nickname: "teste",
        email: "user1@user.com",
        password: "12345678",
      })
    ).user;
    user2 = (
      await createUserUseCase.execute({
        full_name: "opateste2",
        nickname: "teste2",
        email: "user2@user.com",
        password: "12345678",
      })
    ).user;
  });
  it("should be able to get all conversations from a user", async () => {
    await createMessageUseCase.execute({
      fromUserId: user1.id,
      message: "teste",
      toUserId: user2.id,
    });
    const conversations = await getAllConversationsUseCase.execute({
      userId: user1.id,
    });
    expect(conversations).toHaveLength(1);
  });
  it("should not be able to get all conversations from a user that does not exist", async () => {
    await expect(
      getAllConversationsUseCase.execute({
        userId: "nonexistentuser",
      })
    ).rejects.toEqual(new AppError("User not found", 404));
  });
  it("should group by user when there are multiple messages between them", async () => {
    await createMessageUseCase.execute({
      fromUserId: user1.id,
      message: "teste",
      toUserId: user2.id,
    });
    await createMessageUseCase.execute({
      fromUserId: user2.id,
      message: "teste",
      toUserId: user1.id,
    });
    await createMessageUseCase.execute({
      fromUserId: user1.id,
      message: "teste",
      toUserId: user2.id,
    });
    const conversations = await getAllConversationsUseCase.execute({
      userId: user1.id,
    });
    expect(conversations).toHaveLength(1);
  });
  it("should return the last message between users", async () => {
    await createMessageUseCase.execute({
      fromUserId: user1.id,
      message: "teste",
      toUserId: user2.id,
    });
    await new Promise((resolve) => setTimeout(resolve, 1700));

    await createMessageUseCase.execute({
      fromUserId: user2.id,
      message: "teste2",
      toUserId: user1.id,
    });

    await new Promise((resolve) => setTimeout(resolve, 1700));
    await createMessageUseCase.execute({
      fromUserId: user2.id,
      message: "teste3",
      toUserId: user1.id,
    });

    const conversations = await getAllConversationsUseCase.execute({
      userId: user1.id,
    });
    expect(conversations[0].message).toEqual("teste3");
  });
});
