import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class RequestUserToFollowUseCase {
  constructor(
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}
  async execute(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<void> {
    this.followerRepository.create(requestedUserId, requesterUserId);
  }
}

export { RequestUserToFollowUseCase };
