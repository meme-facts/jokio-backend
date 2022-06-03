import { ICommentaryDTO } from "@modules/posts/dtos/ICommentDTO";
import { Comments } from "@modules/posts/infra/typeorm/entities/Comment";
import { ICommentaryRepository } from "../ICommentRepository";

class CommentaryRepositoryInMemory implements ICommentaryRepository {
  private commentaries: Comments[] = [];
  async create({ userId, postId, message }: ICommentaryDTO): Promise<void> {
    const commentary = new Comments();
    Object.assign(commentary, {
      userId,
      postId,
      message,
    });
    this.commentaries.push(commentary);
  }
  async getAll(): Promise<Comments[]> {
    return this.commentaries;
  }
}

export { CommentaryRepositoryInMemory };
