import {
  IGetAllFollowsDTO,
  SortByEnum,
} from "@modules/users/dtos/IGetAllFollowsInputDTO";
import { FollowerEntity } from "@modules/users/entities/Follower";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class GetFollowersByUserUseCase {
  constructor(
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository,
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async execute({
    page,
    limit = 10,
    userId,
    sortBy = "created_at",
  }: IGetAllFollowsDTO): Promise<{
    followers: FollowerEntity[];
    count: number;
  }> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new AppError("User not found.");
    }
    if (sortBy !== SortByEnum.createdAt) {
      throw new AppError("Invalid sort by.");
    }
    return this.followerRepository.getAllFollowers({
      userId,
      sortBy,
      page,
      limit,
    });
  }
}

export { GetFollowersByUserUseCase };
