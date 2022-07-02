import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { AppError } from "@shared/errors/AppError";
import { ResponseStatus, StatusEnum } from "@modules/posts/enums/StatusEnum";
import { IGetPostsByIdDTO } from "@modules/posts/dtos/IGetPostsByUserIdDTO";

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
    posts: Post[];
    count: number;
    relationStatus: StatusEnum | ResponseStatus;
  }> {
    const user = await this.userRepository.getAllById(user_id);
    if (!user) {
      throw new AppError("This users does not exist");
    }
    let relationStatus: StatusEnum | ResponseStatus | null = null;
    if (logged_user !== user_id) {
      try {
        const { fStatus } = await this.followerRepository.getSolicitation(
          user_id,
          logged_user
        );
        relationStatus = fStatus as StatusEnum;
      } catch {
        relationStatus = ResponseStatus.UNKNOWN;
      }
    } else {
      relationStatus = ResponseStatus.OWNER;
    }
    const { posts, count } = await this.postRepository.getAllByUserId({
      page,
      limit,
      user_id,
    });

    return { posts, count, relationStatus };
  }
}

export { ReturnPostByUsersUseCase };
