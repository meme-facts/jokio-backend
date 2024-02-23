import { IGetAllPostResponseDto } from "@modules/posts/dtos/IGetAllPostResponse";
import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { inject, injectable } from "tsyringe";

interface IReactionsQuantity {
  likes: number;
  dislikes: number;
}

@injectable()
class ReturnPostsUseCase {
  constructor(
    @inject("PostRepository")
    private postRepository: IPostRepository,
    @inject("PostLikesRepository")
    private likesRepository: IPostLikeRepository,
    @inject("PostDislikesRepository")
    private dislikeRepository: IPostDislikeRepository
  ) {}
  async execute({ page, limit, user_id }: IGetPostsDTO): Promise<{
    posts: IGetAllPostResponseDto[];
    count: number;
  }> {
    const { posts, count } = await this.postRepository.getAll({ page, limit });

    const returnPost = await Promise.all(
      posts.map(async (post) => {
        const likedByLoggedUser =
          !!(await this.likesRepository.getLikeByPostAndUserId({
            postId: post.id,
            userId: user_id,
          }));
        const dislikedByLoggedUser =
          !!(await this.dislikeRepository.getLikeByPostAndUserId({
            postId: post.id,
            userId: user_id,
          }));
        return {
          ...post,
          likedByLoggedUser,
          dislikedByLoggedUser,
        };
      })
    );

    return {
      posts: returnPost,
      count,
    };
  }
}

export { ReturnPostsUseCase };
