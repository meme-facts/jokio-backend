import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteDislikeUseCase {
  constructor(
    @inject("PostDislikesRepository")
    private reactionRepository: IPostDislikeRepository,
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}
  async execute({ postId, userId }: IReactionsDTO): Promise<void> {
    const reaction = await this.reactionRepository.getLikeByPostAndUserId({
      postId,
      userId,
    });

    if (!reaction) {
      throw new AppError("Reaction not found", 404);
    }

    await this.reactionRepository.delete(reaction.id);
    await this.postRepository.decrementDislike(postId);
  }
}

export { DeleteDislikeUseCase };
