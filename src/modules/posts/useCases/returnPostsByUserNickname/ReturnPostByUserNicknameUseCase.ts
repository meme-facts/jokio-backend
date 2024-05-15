import { IGetPostsByIdDTO } from "@modules/posts/dtos/IGetPostsByUserIdDTO";
import { PostEntity } from "@modules/posts/entities/Post";
import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ReturnPostByUserNicknameUseCase {
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
    userName,
    logged_user_id,
  }: IGetPostsByIdDTO): Promise<{
    posts: PostEntity[];
    count: number;
    relationStatus: FollowerStatusEnum;
  }> {
    const user = await this.userRepository.getByNickName(userName);

    if (!user) {
      throw new AppError("This user does not exist", 404);
    }
    let relationStatus: FollowerStatusEnum | null = null;
    if (logged_user_id !== user.id) {
      try {
        const { fStatus } = await this.followerRepository.getSolicitation(
          user.id,
          logged_user_id
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

export { ReturnPostByUserNicknameUseCase };
