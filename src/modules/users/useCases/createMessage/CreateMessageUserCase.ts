import { ICreateMessageInputDTO } from "@modules/users/dtos/ICreateMessageInputDTO";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateMessageUseCase {
  constructor(
    @inject(EUserRepositories.MessagesRepository)
    private messagesRepository: IMessagesRepository,
    @inject(EUserRepositories.UserRepository)
    private userRepository: IUserRepository
  ) {}
  async execute({
    fromUserId,
    message,
    toUserId,
    isRead = false,
  }: ICreateMessageInputDTO) {
    const loggedUser = await this.userRepository.getById(fromUserId);
    if (!loggedUser) {
      throw new AppError("Logged user not found", 404);
    }
    const targetUser = await this.userRepository.getById(toUserId);
    if (!targetUser) {
      throw new AppError("User not found", 404);
    }
    if (fromUserId === toUserId) {
      throw new AppError("You can't send a message to yourself", 403);
    }
    const createdMessage = await this.messagesRepository.create({
      fromUserId,
      message,
      toUserId,
      isRead,
    });
    return createdMessage;
  }
}
