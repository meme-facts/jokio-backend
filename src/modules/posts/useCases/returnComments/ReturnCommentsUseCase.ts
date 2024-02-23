import { IReturnCommentRequestDTO } from "@modules/posts/dtos/IReturnCommentRequestDTO";
import { Comments } from "@modules/posts/infra/typeorm/entities/Comment";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ReturnCommentsUseCase {
  constructor(
    @inject("CommentRepository")
    private commentsRepository: ICommentRepository,
    @inject("PostRepository")
    private postRepository: IPostRepository
  ) {}

  async execute({ page, limit, postId }: IReturnCommentRequestDTO): Promise<{
    comments: Comments[];
    count: number;
  }> {
    const post = await this.postRepository.getById(postId);
    if (!post) {
      throw new AppError("This post does not exist", 404);
    }
    const { comments, count } = await this.commentsRepository.getAllPaginated({
      page,
      limit,
      postId,
    });
    return { comments, count };
  }
}

export { ReturnCommentsUseCase };
