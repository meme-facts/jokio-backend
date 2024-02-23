import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { PostEntity } from "@modules/posts/entities/Post";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { inject, injectable } from "tsyringe";

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
  }: IGetPostsDTO): Promise<{ posts: PostEntity[]; count: number }> {
    const { posts, count } = await this.postRepository.getByUser({
      page,
      limit,
      user_id,
    });

    return { posts, count };
  }
}

export { ReturnPostByUsersUseCase };
