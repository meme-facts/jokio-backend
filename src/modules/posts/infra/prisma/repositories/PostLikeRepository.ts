import { PostLikeEntity } from "@modules/posts/entities/Like";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class PostLikesRepository implements IPostLikeRepository {
  private repository: Prisma.PostLikesDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().postLikes;
  }
  getAll(): Promise<PostLikeEntity[]> {
    throw new Error("Method not implemented.");
  }

  async createLike(
    { postId, userId }: IReactionsDTO,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const instance = tx ? tx.postLikes : this.repository;
    await instance.create({
      data: {
        userId,
        postId,
      },
    });
  }
  async getLikesByPostId(postId: string) {
    return this.repository.findMany({
      where: {
        postId,
      },
    });
  }
  async getLikeByPostAndUserId({ postId, userId }: IReactionsDTO) {
    return this.repository.findFirst({
      where: {
        postId,
        userId,
      },
    });
  }
  async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const instance = tx ? tx.postLikes : this.repository;
    await instance.delete({
      where: {
        id,
      },
    });
  }
}

export { PostLikesRepository };
