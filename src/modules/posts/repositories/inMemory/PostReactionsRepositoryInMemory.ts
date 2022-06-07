import { PostReaction } from "@modules/posts/infra/typeorm/entities/PostReactions";
import { IPostReactionRepository } from "../IPostReactionRepository";

class PostReactionsRepositoryInMemory implements IPostReactionRepository {
  private postReactions: PostReaction[] = [];
  async create({ postId, userId, reactionType }: IReactionsDTO): Promise<void> {
    const postReaction = new PostReaction();
    Object.assign(postReaction, {
      postId,
      userId,
      reactionType,
    });
    this.postReactions.push(postReaction);
  }
}

export { PostReactionsRepositoryInMemory };
