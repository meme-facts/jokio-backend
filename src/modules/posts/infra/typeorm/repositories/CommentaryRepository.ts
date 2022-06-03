import { ICommentaryDTO } from "@modules/posts/dtos/ICommentaryDTO";
import { ICommentaryRepository } from "@modules/posts/repositories/ICommentaryRepository";
import { getRepository, Repository } from "typeorm";
import { Comments } from "../entities/Comment";

class CommentaryRepository implements ICommentaryRepository {
  private repository: Repository<Comments>;
  constructor() {
    this.repository = getRepository(Comments);
  }

  async create({ userId, postId, message }: ICommentaryDTO): Promise<void> {
    const commentary = this.repository.create({
      userId,
      postId,
      message,
    });
    await this.repository.save(commentary);
  }
  async getAll(): Promise<Comments[]> {
    const comments = await this.repository.find();
    return comments;
  }
}

export { CommentaryRepository };
