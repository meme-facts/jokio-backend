import { IGetPostsByIdDTO } from "@modules/posts/dtos/IGetPostsByUserIdDTO";
import { PostEntity } from "@modules/posts/entities/Post";
import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ReturnPostByUsersUseCase {
  constructor(
    @inject("PostRepository")
    private postRepository: IPostRepository,
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({
    page,
    limit,
    user_id,
    logged_user,
  }: IGetPostsByIdDTO): Promise<{
    posts: PostEntity[];
    count: number;
    relationStatus: FollowerStatusEnum;
  }> {
    const user = await this.userRepository.getByNickName(user_id);
    if (!user) {
      throw new AppError("This users does not exist");
    }
    let relationStatus: FollowerStatusEnum | null = null;
    if (logged_user !== user.id) {
      try {
        const { fStatus } = await this.followerRepository.getSolicitation(
          user.id,
          logged_user
        );
        relationStatus = fStatus as FollowerStatusEnum;
      } catch {
        relationStatus = FollowerStatusEnum.UNKNOWN;
      }
    } else {
      relationStatus = FollowerStatusEnum.OWNER;
    }
    const { posts, count } = await this.postRepository.getAllByUserId({
      page,
      limit,
      user_id: user.id,
    });

    return { posts, count, relationStatus };
  }
}

export { ReturnPostByUsersUseCase };
