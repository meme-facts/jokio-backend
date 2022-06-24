import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateReactionUseCase {
  constructor(
    @inject("PostReactionRepository")
    private reactionsRepository: IPostReactionRepository,
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}
  async execute({
    postId,
    userId,
    reactionType,
  }: IReactionsDTO): Promise<void> {
    const post = await this.postRepository.getById(postId);
    if (!post) {
      throw new AppError("This post does not exist", 404);
    }
    await this.reactionsRepository.create({
      postId,
      userId,
      reactionType,
    });
  }
}

export { CreateReactionUseCase };
