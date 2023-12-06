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
class GetFollowingByUserUseCase {
  constructor(
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository,
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async execute({
    page,
    limit = 10,
    userId,
    sortBy = SortByEnum.createdAt,
  }: IGetAllFollowsDTO): Promise<{
    following: FollowerEntity[];
    count: number;
  }> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    if (sortBy !== SortByEnum.createdAt && sortBy !== SortByEnum.points) {
      throw new AppError("Invalid sort by.");
    }
    return this.followerRepository.getAllFollowing({
      userId,
      sortBy,
      page,
      limit,
    });
  }
}

export { GetFollowingByUserUseCase };
