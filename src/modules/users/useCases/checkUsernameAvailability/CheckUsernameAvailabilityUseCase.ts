import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { inject, injectable } from "tsyringe";

interface ICheckUsernameAvailabilityInput {
  nickname: string;
  loggedUserId: string;
}

@injectable()
export class CheckUsernameAvailabilityUseCase {
  constructor(
    @inject(EUserRepositories.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}
  async execute({
    nickname,
    loggedUserId,
  }: ICheckUsernameAvailabilityInput): Promise<Boolean> {
    const user = await this.userRepository.getByNickName(nickname);
    if (!user) {
      return true;
    }
    if (user.id === loggedUserId) {
      return true;
    }
    return false;
  }
}
