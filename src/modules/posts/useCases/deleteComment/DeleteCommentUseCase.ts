import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteCommentUseCase {
  constructor(
    @inject("CommentRepository")
    private commentRepository: ICommentRepository,
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}
  async execute(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.getById(commentId);

    if (!comment) throw new AppError("This comment does not exist", 404);
    const { user_id: postOwnerId } = await this.postRepository.getById(
      comment.postId
    );

    if (userId !== comment.userId && userId !== postOwnerId) {
      throw new AppError(
        "Comment can only be deleted by owner or by post owner",
        401
      );
    }

    await this.commentRepository.delete(commentId);
  }
}

export { DeleteCommentUseCase };
