import { ICommentDTO } from "../dtos/ICommentDTO";
import { IReturnCommentRequestDTO } from "../dtos/IReturnCommentRequestDTO";
import { CommentEntity } from "../entities/Comments";

interface ICommentRepository {
  create({ userId, postId, message }: ICommentDTO): Promise<void>;
  getAll(): Promise<CommentEntity[]>;
  delete(commentId: string): Promise<void>;
  getById(commentId: string): Promise<CommentEntity>;
  getAllPaginated({ page, limit, postId }: IReturnCommentRequestDTO): Promise<{
    comments: CommentEntity[];
    count: number;
  }>;
}

export { ICommentRepository };
