import { ICommentDTO } from "../dtos/ICommentDTO";
import { Comments } from "../infra/typeorm/entities/Comment";

interface ICommentRepository {
  create({ userId, postId, message }: ICommentDTO): Promise<void>;
  getAll(): Promise<Comments[]>;
  delete(commentId: string): Promise<void>;
  getById(commentId: string): Promise<Comments>;
}

export { ICommentRepository };
