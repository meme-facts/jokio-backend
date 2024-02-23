import { PostLikeEntity } from "@modules/posts/entities/Like";
import { randomUUID } from "crypto";
import { IPostLikeRepository } from "../IPostLikeRepository";

class PostReactionsRepositoryInMemory implements IPostLikeRepository {
  async createLike(
    { postId, userId }: IReactionsDTO,
    tx?: unknown
  ): Promise<void> {
    const postReaction = new PostLikeEntity();
    Object.assign(postReaction, {
      id: randomUUID(),
      postId,
      userId,
    });
    this.postReactions.push(postReaction);
  }
  async getLikesByPostId(postId: string): Promise<PostLikeEntity[]> {
    const reaction = await this.postReactions.filter(
      (reaction) => reaction.postId === postId
    );
    return reaction;
  }
  async getLikeByPostAndUserId({
    postId,
    userId,
  }: IReactionsDTO): Promise<PostLikeEntity> {
    const reaction = await this.postReactions.find(
      (reaction) => reaction.postId === postId && reaction.userId === userId
    );
    return reaction;
  }
  private postReactions: PostLikeEntity[] = [];
  async create({ postId, userId }: IReactionsDTO): Promise<void> {
    const postReaction = new PostLikeEntity();
    Object.assign(postReaction, {
      postId,
      userId,
    });
    this.postReactions.push(postReaction);
  }
  async getAll(): Promise<PostLikeEntity[]> {
    return this.postReactions;
  }
  async getReaction({
    postId,
    userId,
  }: IReactionsDTO): Promise<PostLikeEntity> {
    const reaction = await this.postReactions.find(
      (reaction) => reaction.postId === postId && reaction.userId === userId
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
