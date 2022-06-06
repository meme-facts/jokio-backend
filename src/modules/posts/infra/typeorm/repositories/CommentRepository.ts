import { ICommentDTO } from "@modules/posts/dtos/ICommentDTO";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { getRepository, Repository } from "typeorm";
import { Comments } from "../entities/Comment";

class CommentRepository implements ICommentRepository {
  private repository: Repository<Comments>;
  constructor() {
    this.repository = getRepository(Comments);
  }

  async create({ userId, postId, message, id }: ICommentDTO): Promise<void> {
    const commentary = this.repository.create({
      userId,
      postId,
      message,
      id,
    });
    await this.repository.save(commentary);
  }
  async getAll(): Promise<Comments[]> {
    const comments = await this.repository.find();
    return comments;
  }
  async delete(commentId: string): Promise<void> {
    await this.repository.delete(commentId);
  }

  async getById(commentId: string): Promise<Comments> {
    const comment = await this.repository.findOne(commentId);
    return comment;
  }
}

export { CommentRepository };
