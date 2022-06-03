import { ICommentaryDTO } from "@modules/posts/dtos/ICommentDTO";
import { ICommentaryRepository } from "@modules/posts/repositories/ICommentRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCommentaryUseCase {
  constructor(
    @inject("CommentaryRepository")
    private commentaryRepository: ICommentaryRepository,
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}
  async execute({ userId, postId, message }: ICommentaryDTO): Promise<void> {
    const post = await this.postRepository.getById(postId);

    if (!post) {
      throw new AppError("This post does not exist");
    }
    await this.commentaryRepository.create({
      userId,
      postId,
      message,
    });
  }
}

export { CreateCommentaryUseCase };
