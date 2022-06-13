import { PostReactionRepository } from "@modules/posts/infra/typeorm/repositories/PostReactionRepository";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteReactionUseCase {
  constructor(
    @inject("PostReactionRepository")
    private reactionRepository: IPostReactionRepository
  ) {}
  async execute({
    postId,
    reactionType,
    userId,
  }: IReactionsDTO): Promise<void> {
    const reaction = await this.reactionRepository.getReaction({
      postId,
      reactionType,
      userId,
    });
    console.log(postId, userId, reactionType);
    if (!reaction) {
      throw new AppError("Reaction not found", 404);
    }

    await this.reactionRepository.delete(reaction.id);
  }
}

export { DeleteReactionUseCase };
