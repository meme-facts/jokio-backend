import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { PostEntity } from "@modules/posts/entities/Post";
import { randomUUID } from "crypto";
import { IPostRepository } from "../IPostRepository";

class PostRepositoryInMemory implements IPostRepository {
  posts: PostEntity[] = [];
  async create({
    id,
    postDescription,
    user_id,
    img_url,
  }: IPostDTO): Promise<PostEntity> {
    const post = new PostEntity();
    Object.assign(post, {
      id: id ?? randomUUID(),
      postDescription,
      user_id,
      img_url,
      isActive: true,
      created_at: new Date(),
      updated_at: new Date(),
      likeCount: 0,
      dislikeCount: 0,
    });
    this.posts.push(post);
    return post;
  }
  async getById(postId: string): Promise<PostEntity> {
    return this.posts.find((post) => post.id === postId);
  }
  async getAll({
    page,
    limit,
  }: IGetPostsDTO): Promise<{ posts: PostEntity[]; count: number }> {
    const count = this.posts.length;
    const posts: PostEntity[] = this.posts.slice(
      (page - 1) * limit,
      page * limit
    );

    return { posts, count };
  }
  async getByUser({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: PostEntity[]; count: number }> {
    const postsByUser = this.posts.filter((post) => post.user_id === user_id);
    const count = postsByUser.length;
    const posts = postsByUser.slice((page - 1) * limit, page * limit);
    return { posts, count };
  }
  getAllByUserId({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: PostEntity[]; count: number }> {
    throw new Error("Method not implemented.");
  }
  async incrementLike(postId: string, tx?: unknown): Promise<void> {
    const post = await this.posts.find((post) => post.id === postId);
    post.likeCount++;
  }
  async decrementLike(postId: string, tx?: unknown): Promise<void> {
    const post = await this.posts.find((post) => post.id === postId);
    post.likeCount--;
  }
  async incrementDislike(postId: string, tx?: unknown): Promise<void> {
    const post = await this.posts.find((post) => post.id === postId);
    post.dislikeCount++;
  }
  async decrementDislike(postId: string, tx?: unknown): Promise<void> {
    const post = await this.posts.find((post) => post.id === postId);
    post.dislikeCount--;
  }
}

export { PostRepositoryInMemory };
