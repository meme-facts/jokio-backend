import { GetAllConversationsResponseDTO } from "@modules/users/infra/class-validator/messages/GetAllConversationsResponse.dto";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { AppError } from "@shared/errors/AppError";
import { plainToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetAllConversationsUseCase {
  constructor(
    @inject(EUserRepositories.MessagesRepository)
    private messageRepository: IMessagesRepository,
    @inject(EUserRepositories.UserRepository)
    private userRepository: IUserRepository
  ) {}
  async execute({ userId }: IGetAllMessagesDTO) {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const conversations = await this.messageRepository.getAllFromUser({
      userId,
    });

    const conversationWithUser = conversations.map((conversation) => {
      const chattingWith =
        conversation.fromUserId === userId
          ? conversation.toUser
          : conversation.fromUser;
      return {
        ...conversation,
        chattingWith,
      };
    });
    return plainToInstance(
      GetAllConversationsResponseDTO,
      conversationWithUser
    );
  }
}
