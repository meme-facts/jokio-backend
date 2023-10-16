import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { PrismaClient } from "@prisma/client";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateLikeUseCase {
  constructor(
    @inject("PostLikesRepository")
    private reactionsRepository: IPostLikeRepository,
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
    await this.postRepository.incrementLike(postId);
  }
}

export { CreateLikeUseCase };
