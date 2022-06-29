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
    private postRepository: IPostRepository
  ) {}
  async execute({ page, limit }: IGetPostsDTO): Promise<Post[]> {
    const posts = await this.postRepository.getAll({ page, limit });

    return posts;
  }
}

export { ReturnPostsUseCase };
