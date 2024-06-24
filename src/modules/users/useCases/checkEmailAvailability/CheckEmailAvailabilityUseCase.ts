import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { inject, injectable } from "tsyringe";

export interface ICheckEmailAvailabilityInput {
  email: string;
  loggedUserId: string;
}

@injectable()
export class CheckEmailAvailabilityUseCase {
  constructor(
    @inject(EUserRepositories.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}
  async execute({
    email,
    loggedUserId,
  }: ICheckEmailAvailabilityInput): Promise<Boolean> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return true;
    }
    if (user.id === loggedUserId) {
      return true;
    }
    return false;
  }
}
