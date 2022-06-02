import { IGetUserByIdDTO } from "@modules/users/dtos/IGetUserByIdDTO";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { StatusEnum } from "@shared/enums/StatusEnum";
import { inject, injectable } from "tsyringe";

interface IUserResponse extends User {
  followersQuantity: number;
  followingQuantity: number;
  relationStatus?: StatusEnum;
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
    requestUserId,
  }: IGetUserByIdDTO): Promise<IUserResponse> {
    const user = await this.userRepository.getAllById(requestUserId);
    const { followersQuantity, followingQuantity } =
      await this.followerRepository.getRelationsQuantityByUser(requestUserId);
    return {
      ...user,
      followersQuantity,
      followingQuantity,
    };
  }
}

export { GetUserByIdUseCase };
