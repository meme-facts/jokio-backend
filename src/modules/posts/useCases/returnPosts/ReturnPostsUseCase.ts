import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";

interface IReactionsQuantity {
  likes: number;
  dislikes: number;
}

@injectable()
class ReturnPostsUseCase {
  constructor(
    @inject("PostRepository")
    private postRepository: IPostRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: Post[]; reactions: IReactionsQuantity }> {
    const posts = await this.postRepository.getAll({ page, limit, user_id });

    return posts;
  }
}

export { ReturnPostsUseCase };
