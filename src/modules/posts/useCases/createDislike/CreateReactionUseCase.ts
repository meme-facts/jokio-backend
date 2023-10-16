import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateDislikeUseCase {
  constructor(
    @inject("PostDislikesRepository")
    private reactionsRepository: IPostDislikeRepository,
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}
  async execute({ postId, userId }: IReactionsDTO): Promise<void> {
    const post = await this.postRepository.getById(postId);
    if (!post) {
      throw new AppError("This post does not exist", 404);
    }
    await this.reactionsRepository.createLike({
      postId,
      userId,
    });
    await this.postRepository.incrementDislike(postId);
  }
}

export { CreateDislikeUseCase };
