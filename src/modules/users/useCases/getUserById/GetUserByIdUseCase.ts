import { ResponseStatus, StatusEnum } from "@modules/posts/enums/StatusEnum";
import { IGetUserByIdDTO } from "@modules/users/dtos/IGetUserByIdDTO";
import { UserEntity } from "@modules/users/entities/User";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";

import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IUserResponse
  extends Omit<UserEntity, "password" | "updated_at" | "email" | "post"> {
  followersQuantity: number;
  followingQuantity: number;
  relationStatus: StatusEnum | ResponseStatus;
}

@injectable()
class GetUserByIdUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository
  ) {}
  async execute({
    loggedUserId,
    requestedUserId,
  }: IGetUserByIdDTO): Promise<IUserResponse> {
    const user = await this.userRepository.getAllById(requestedUserId);

    if (!user) {
      throw new AppError("This users does not exist");
    }
    let relationStatus: StatusEnum | ResponseStatus | null = null;
    if (loggedUserId !== requestedUserId) {
      try {
        const { fStatus } = await this.followerRepository.getSolicitation(
          requestedUserId,
          loggedUserId
        );
        relationStatus = fStatus as StatusEnum;
      } catch {
        relationStatus = ResponseStatus.UNKNOWN;
      }
    } else {
      relationStatus = ResponseStatus.OWNER;
    }
    const { followersQuantity, followingQuantity } =
      await this.followerRepository.getRelationsQuantityByUser(requestedUserId);
    const { id, full_name, nickname, isPrivate, created_at, img_url } = user;
    const response = {
      id,
      full_name,
      nickname,
      isPrivate,
      img_url,
      created_at,
      followersQuantity,
      followingQuantity,
      relationStatus,
    };

    return response;
  }
}

export { GetUserByIdUseCase };
