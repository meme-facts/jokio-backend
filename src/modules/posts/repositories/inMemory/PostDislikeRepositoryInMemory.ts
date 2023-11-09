import { PostReaction } from "@modules/posts/infra/typeorm/entities/PostReactions";
import { IPostDislikeRepository } from "../IPostDislikeRepository";
import { IPostLikeRepository } from "../IPostLikeRepository";
import { randomUUID } from "crypto";
import { PostDislikeEntity } from "@modules/posts/entities/Dislike";

class PostDislikeRepositoryInMemory implements IPostDislikeRepository {
  async createLike(
    { postId, userId }: IReactionsDTO,
    tx?: unknown
  ): Promise<void> {
    const postReaction = new PostDislikeEntity();
    Object.assign(postReaction, {
      id: randomUUID(),
      postId,
      userId,
    });
    this.postReactions.push(postReaction);
  }
  async getLikesByPostId(postId: string): Promise<PostDislikeEntity[]> {
    const reaction = await this.postReactions.filter(
      (reaction) => reaction.postId === postId
    );
    return reaction;
  }
  async getLikeByPostAndUserId({
    postId,
    userId,
  }: IReactionsDTO): Promise<PostDislikeEntity> {
    const reaction = await this.postReactions.find(
      (reaction) => reaction.postId === postId && reaction.userId === userId
    );
    return reaction;
  }
  private postReactions: PostDislikeEntity[] = [];
  async create({ postId, userId }: IReactionsDTO): Promise<void> {
    const postReaction = new PostDislikeEntity();
    Object.assign(postReaction, {
      postId,
      userId,
    });
    this.postReactions.push(postReaction);
  }
  async getAll(): Promise<PostDislikeEntity[]> {
    return this.postReactions;
  }
  async getReaction({
    postId,
    userId,
  }: IReactionsDTO): Promise<PostDislikeEntity> {
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

export { PostDislikeRepositoryInMemory };
