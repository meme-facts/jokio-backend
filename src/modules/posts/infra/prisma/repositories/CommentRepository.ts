import { ICommentDTO } from "@modules/posts/dtos/ICommentDTO";
import { IReturnCommentRequestDTO } from "@modules/posts/dtos/IReturnCommentRequestDTO";
import { CommentEntity } from "@modules/posts/entities/Comments";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class CommentRepository implements ICommentRepository {
  private repository: Prisma.CommentsDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().comments;
  }
  async getAllPaginated({
    page,
    limit = 10,
    postId,
  }: IReturnCommentRequestDTO): Promise<{
    comments: CommentEntity[];
    count: number;
  }> {
    const offset: number = (page - 1) * limit;
    const [comments, count] = await Promise.all([
      this.repository.findMany({
        where: {
          postId,
        },
        take: limit,
        skip: offset,
      }),
      this.repository.count({
        where: {
          postId,
        },
        take: limit,
        skip: offset,
      }),
    ]);
    return {
      comments,
      count,
    };
  }

  async create({ userId, postId, message, id }: ICommentDTO): Promise<void> {
    await this.repository.create({
      data: {
        userId,
        postId,
        message,
        id,
      },
    });
  }
  async getAll(): Promise<CommentEntity[]> {
    const comments = await this.repository.findMany();
    return comments;
  }
  async delete(commentId: string): Promise<void> {
    await this.repository.delete({
      where: {
        id: commentId,
      },
    });
  }

  async getById(commentId: string): Promise<CommentEntity> {
    const comment = await this.repository.findFirst({
      where: {
        id: commentId,
      },
    });
    return comment;
  }
}

export { CommentRepository };
