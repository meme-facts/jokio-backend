import { PostLikeEntity } from "../entities/Like";

interface IPostLikeRepository {
  createLike({ postId, userId }: IReactionsDTO, tx?: unknown): Promise<void>;
  getLikesByPostId(postId: string): Promise<PostLikeEntity[] | undefined>;
  getLikeByPostAndUserId({
    postId,
    userId,
  }: IReactionsDTO): Promise<PostLikeEntity | undefined>;
  delete(id: string, tx?: unknown): Promise<void>;
  getAll(): Promise<PostLikeEntity[]>;
}

export { IPostLikeRepository };
