import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostDislikeRepository";

interface IReactionsQuantity {
  likes: number;
  dislikes: number;
}

@injectable()
class ReturnPostByUsersUseCase {
  constructor(
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}
  async execute({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: Post[]; count: number }> {
    const { posts, count } = await this.postRepository.getByUser({
      page,
      limit,
      user_id,
    });

    return { posts, count };
  }
}

export { ReturnPostByUsersUseCase };
