import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";

import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RequestUserToFollowUseCase {
  constructor(
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<void> {
    const requestedUser = await this.userRepository.getById(requestedUserId);
    const requesterUser = await this.userRepository.getById(requesterUserId);
    if (!requestedUser || !requesterUser) {
      throw new AppError("This user does not exist!", 404);
    }
    if (requestedUserId === requesterUserId) {
      throw new AppError("Users can not send self solicitations!");
    }
    const alreadySentSolicitation =
      await this.followerRepository.getSolicitation(
        requestedUserId,
        requesterUserId
      );
    if (alreadySentSolicitation) {
      throw new AppError("Users can create only one solicitation!");
    }
    await this.followerRepository.create({
      requestedUserId,
      requesterUserId,
      fStatus: requestedUser.isPrivate
        ? FollowerStatusEnum.Pending
        : FollowerStatusEnum.Accepted,
    });
  }
}

export { RequestUserToFollowUseCase };
