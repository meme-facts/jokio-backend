import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class PostDislikesRepository implements IPostDislikeRepository {
  private repository: Prisma.PostDislikesDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().postDislikes;
  }

  async createLike(
    { postId, userId }: IReactionsDTO,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const instance = tx ? tx.postDislikes : this.repository;
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
    const instance = tx ? tx.postDislikes : this.repository;
    await instance.delete({
      where: {
        id,
      },
    });
  }
}

export { PostDislikesRepository };
