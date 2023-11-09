import { IGetAllPostResponseDto } from "@modules/posts/dtos/IGetAllPostResponse";
import { IGetPostByIdDTO } from "@modules/posts/dtos/IGetPostByIdDTO";
import { PostEntity } from "@modules/posts/entities/Post";
import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IReturnPostWithReactions extends PostEntity {
  likedByLoggedUser: boolean;
  dislikedByLoggedUser: boolean;
}

@injectable()
class ReturnPostByIdUseCase {
  constructor(
    @inject("PostRepository")
    private postRepository: IPostRepository,
    @inject("PostLikesRepository")
    private likesRepository: IPostLikeRepository,
    @inject("PostDislikesRepository")
    private dislikeRepository: IPostDislikeRepository
  ) {}
  async execute({
    postId,
    loggedUserId,
  }: IGetPostByIdDTO): Promise<IReturnPostWithReactions> {
    const post = await this.postRepository.getById(postId);
    if (!post) {
      throw new AppError("Post not found.", 404);
    }
    const likedByLoggedUser =
      !!(await this.likesRepository.getLikeByPostAndUserId({
        postId: post.id,
        userId: loggedUserId,
      }));
    const dislikedByLoggedUser =
      !!(await this.dislikeRepository.getLikeByPostAndUserId({
        postId: post.id,
        userId: loggedUserId,
      }));
    return {
      ...post,
      likedByLoggedUser,
      dislikedByLoggedUser,
    };
  }
}

export { ReturnPostByIdUseCase };
