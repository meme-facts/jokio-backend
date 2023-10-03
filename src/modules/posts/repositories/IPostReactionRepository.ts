import { postReactions } from "@prisma/client";

interface IPostReactionRepository {
  create({ postId, userId, reactionType }: IReactionsDTO): Promise<void>;
  getAll(): Promise<postReactions[]>;
  getReaction({
    postId,
    reactionType,
    userId,
  }: IReactionsDTO): Promise<postReactions>;
  delete(id: string): Promise<void>;
}

export { IPostReactionRepository };
