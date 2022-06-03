import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { Post } from "@modules/posts/infra/typeorm/entities/Post";
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
}

export { PostRepositoryInMemory };
