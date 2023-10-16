import { IGetPostsDTO } from "../dtos/IGetPostsDTO";
import { IPostDTO } from "../dtos/IPostDTO";
import { PostEntity } from "../entities/Post";

interface IPostRepository {
  create({ postDescription, user_id, img_url }: IPostDTO): Promise<PostEntity>;
  getById(postId: string, tx?: unknown): Promise<PostEntity>;
  getAll({
    page,
    limit,
  }: IGetPostsDTO): Promise<{ posts: PostEntity[]; count: number }>;
  getByUser({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: PostEntity[]; count: number }>;
  getAllByUserId({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: PostEntity[]; count: number }>;
  incrementLike(postId: string, tx?: unknown): Promise<void>;
  decrementLike(postId: string, tx?: unknown): Promise<void>;
  incrementDislike(postId: string, tx?: unknown): Promise<void>;
  decrementDislike(postId: string, tx?: unknown): Promise<void>;
}

export { IPostRepository };
