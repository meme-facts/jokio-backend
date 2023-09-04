import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";
import { Prisma, PrismaClient, postReactions } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";

class PostReactionRepository implements IPostReactionRepository {
  private repository: Prisma.postReactionsDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().postReactions;
  }

  async create({ postId, userId, reactionType }: IReactionsDTO): Promise<void> {
    await this.repository.create({
      data: {
        userId,
        postId,
        reactionType,
      },
    });
  }
  async getAll(): Promise<postReactions[]> {
    return this.repository.findMany();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({
      where: {
        id,
      },
    });
  }

  async getReaction({
    postId,
    reactionType,
    userId,
  }: IReactionsDTO): Promise<postReactions> {
    const reaction = await this.repository.findFirst({
      where: {
        postId,
        reactionType,
        userId,
      },
    });
    return reaction;
  }
}

export { PostReactionRepository };
