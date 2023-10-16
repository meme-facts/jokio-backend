import { PostDislikeEntity } from "../entities/Dislike";

interface IPostDislikeRepository {
  createLike({ postId, userId }: IReactionsDTO, tx?: unknown): Promise<void>;
  getLikesByPostId(postId: string): Promise<PostDislikeEntity[] | undefined>;
  getLikeByPostAndUserId({
    postId,
    userId,
  }: IReactionsDTO): Promise<PostDislikeEntity | undefined>;
  delete(id: string, tx?: unknown): Promise<void>;
}

export { IPostDislikeRepository };
