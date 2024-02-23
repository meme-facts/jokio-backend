import { IGetRequestsDTO } from "@modules/users/dtos/IGetRequestsDTO";
import { FollowerEntity } from "@modules/users/entities/Follower";
import { Follower } from "@modules/users/infra/typeorm/entities/Followers";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class GetPendingRelationsByUserUseCase {
  constructor(
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({
    page,
    limit = 5,
    userId,
  }: IGetRequestsDTO): Promise<{ requests: FollowerEntity[]; count: number }> {
    const user = await this.userRepository.getById(userId);
    if (!user.isPrivate) {
      throw new AppError("Public users do not receive friend request.");
    }
    const relations = await this.followerRepository.getPendingRequestsById({
      page,
      limit,
      userId,
    });
    return relations;
  }
}

export { GetPendingRelationsByUserUseCase };
