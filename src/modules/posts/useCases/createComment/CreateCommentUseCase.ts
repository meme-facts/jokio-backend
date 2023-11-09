import { ICommentDTO } from "@modules/posts/dtos/ICommentDTO";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCommentUseCase {
  constructor(
    @inject("CommentRepository")
    private commentaryRepository: ICommentRepository,
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}
  async execute({ userId, postId, message }: ICommentDTO): Promise<void> {
    const post = await this.postRepository.getById(postId);

    if (!post) {
      throw new AppError("This post does not exist", 404);
    }
    await this.commentaryRepository.create({
      userId,
      postId,
      message,
    });
  }
}

export { CreateCommentUseCase };
