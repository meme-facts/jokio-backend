import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { ReactionTypeEnum } from "@modules/posts/enums/ReactionTypeEnum";
import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { PostReaction } from "@modules/posts/infra/typeorm/entities/PostReactions";
import { IPostRepository } from "../IPostRepository";

class PostRepositoryInMemory implements IPostRepository {
  posts: Post[] = [];
  async create({ postDescription, user_id, img_url }: IPostDTO): Promise<Post> {
    const post = new Post();
    Object.assign(post, {
      postDescription,
      user_id,
      img_url,
    });
    this.posts.push(post);
    return post;
  }
  async getById(postId: string): Promise<Post> {
    return this.posts.find((post) => post.id === postId);
  }
  async getAll({ page, limit }: IGetPostsDTO): Promise<Post[]> {
    const paginatedValues: Post[] = this.posts.slice(
      (page - 1) * limit,
      page * limit
    );

    return paginatedValues;
  }

  async getByUser({ page, limit, user_id }: IGetPostsDTO) {
    throw new Error("Method not implemented.");
  }
}

export { PostRepositoryInMemory };
