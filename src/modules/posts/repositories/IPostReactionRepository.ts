import { PostReaction } from "../infra/typeorm/entities/PostReactions";

interface IPostReactionRepository {
  create({ postId, userId, reactionType }: IReactionsDTO): Promise<void>;
  getAll(): Promise<PostReaction[]>;
  getReaction({
    postId,
    reactionType,
    userId,
  }: IReactionsDTO): Promise<PostReaction>;
  delete(id: string): Promise<void>;
}

export { IPostReactionRepository };
