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
  async getAll(): Promise<PostReaction[]> {
    return this.postReactions;
  }
  async getReaction(id: string): Promise<PostReaction> {
    const reaction = await this.postReactions.find(
      (reaction) => reaction.id === id
    );
    return reaction;
  }
  async delete(id: string): Promise<void> {
    const reactionIndex = this.postReactions.findIndex(
      (reaction) => reaction.id === id
    );
    this.postReactions.splice(reactionIndex, 1);
  }
}

export { PostReactionsRepositoryInMemory };
