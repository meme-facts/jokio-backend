import { ICommentDTO } from "@modules/posts/dtos/ICommentDTO";
import { Comments } from "@modules/posts/infra/typeorm/entities/Comment";
import { ICommentRepository } from "../ICommentRepository";

class CommentRepositoryInMemory implements ICommentRepository {
  private commentaries: Comments[] = [];
  async create({ userId, postId, message, id }: ICommentDTO): Promise<void> {
    const comment = await this.getById(id);
    if (comment) {
      comment.message = message;
    } else {
      const commentary = new Comments();
      Object.assign(commentary, {
        userId,
        postId,
        message,
      });
      this.commentaries.push(commentary);
    }
  }
  async getAll(): Promise<Comments[]> {
    return this.commentaries;
  }
  async delete(commentId: string): Promise<void> {
    const commentIndex = await this.commentaries.findIndex(
      (comment) => comment.id === commentId
    );
    this.commentaries.splice(commentIndex, 1);
  }
  async getById(commentId: string): Promise<Comments> {
    const comment = this.commentaries.find(
      (comment) => comment.id === commentId
    );
    return comment;
  }
}

export { CommentRepositoryInMemory };
