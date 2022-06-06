import { ICommentDTO } from "@modules/posts/dtos/ICommentDTO";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IUpdateComment {
  id: string;
  message: string;
  userId: string;
}
@injectable()
class UpdateCommentUseCase {
  constructor(
    @inject("CommentRepository")
    private commentRepository: ICommentRepository
  ) {}
  async execute({ id, message, userId }: IUpdateComment): Promise<void> {
    const comment = await this.commentRepository.getById(id);
    if (!comment) {
      throw new AppError("Comment not found!", 404);
    }
    if (comment.userId !== userId) {
      throw new AppError("Only comment author is allowed to update it!", 401);
    }
    comment.message = message;
    await this.commentRepository.create(comment);
  }
}
export { UpdateCommentUseCase };
