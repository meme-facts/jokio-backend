import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IGetUserByIdDTO } from "@modules/users/dtos/IGetUserByIdDTO";
import { UserEntity } from "@modules/users/entities/User";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";

import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IUserResponse extends Omit<UserEntity, "password"> {
  followersQuantity: number;
  followingQuantity: number;
  relationStatus: FollowerStatusEnum;
}

@injectable()
class GetUserByNickNameUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository
  ) {}
  async execute({
    loggedUserId,
    requestedUserNickName,
  }: IGetUserByIdDTO): Promise<IUserResponse> {
    const user = await this.userRepository.getByNickName(requestedUserNickName);

    if (!user) {
      throw new AppError("This users does not exist");
    }
    let relationStatus: FollowerStatusEnum | null = null;
    if (loggedUserId !== user.id) {
      try {
        const { fStatus } = await this.followerRepository.getSolicitation(
          user.id,
          loggedUserId
        );
        relationStatus = fStatus as FollowerStatusEnum;
      } catch {
        relationStatus = FollowerStatusEnum.UNKNOWN;
      }
    } else {
      relationStatus = FollowerStatusEnum.OWNER;
    }
    const { followersQuantity, followingQuantity } =
      await this.followerRepository.getRelationsQuantityByUser(user.id);
    const {
      id,
      full_name,
      nickname,
      isPrivate,
      created_at,
      email,
      updated_at,
      img_url,
    } = user;
    const response = {
      id,
      full_name,
      nickname,
      isPrivate,
      img_url,
      email,
      updated_at,
      created_at,
      followersQuantity,
      followingQuantity,
      relationStatus,
    };

    return response;
  }
}

export { GetUserByNickNameUseCase };
