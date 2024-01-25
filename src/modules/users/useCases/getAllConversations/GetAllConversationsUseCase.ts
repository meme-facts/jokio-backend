import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { AppError } from "@shared/errors/AppError";
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
    return conversations;
  }
}
