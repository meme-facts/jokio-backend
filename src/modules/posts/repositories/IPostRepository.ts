import { posts } from "@prisma/client";
import { IGetPostsDTO } from "../dtos/IGetPostsDTO";
import { IPostDTO } from "../dtos/IPostDTO";
import { Post } from "../infra/typeorm/entities/Post";

interface IPostRepository {
  create({ postDescription, user_id, img_url }: IPostDTO): Promise<posts>;
  getById(postId: string): Promise<posts>;
  getAll({
    page,
    limit,
  }: IGetPostsDTO): Promise<{ posts: posts[]; count: number }>;
  getByUser({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: posts[]; count: number }>;
  getAllByUserId({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: posts[]; count: number }>;
}

export { IPostRepository };
