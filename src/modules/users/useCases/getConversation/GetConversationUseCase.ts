import { IGetConversationDTO } from "@modules/users/dtos/IGetConversationDTO";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { AppError } from "@shared/errors/AppError";
import { log } from "console";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetConversationUseCase {
  constructor(
    @inject(EUserRepositories.UserRepository)
    private userRepository: IUserRepository,
    @inject(EUserRepositories.MessagesRepository)
    private messagesRepository: IMessagesRepository
  ) {}
  async execute({
    loggedUserId,
    targetUserId,
    page,
    limit,
  }: IGetConversationDTO) {
    const loggedUser = await this.userRepository.getById(loggedUserId);

    if (!loggedUser) {
      throw new AppError("Logged user not found", 404);
    }
    const targetUser = await this.userRepository.getById(targetUserId);
    if (!targetUser) {
      throw new AppError("User not found", 404);
    }
    if (loggedUser.id === targetUser.id) {
      throw new AppError("You can't get a conversation with yourself", 403);
    }

    const messages = await this.messagesRepository.getMessagesBetweenUsers({
      loggedUser: loggedUserId,
      targetUser: targetUserId,
      page,
      limit,
    });
    return messages;
  }
}
