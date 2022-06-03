import { ICommentaryDTO } from "../dtos/ICommentaryDTO";
import { Comments } from "../infra/typeorm/entities/Comment";

interface ICommentaryRepository {
  create({ userId, postId, message }: ICommentaryDTO): Promise<void>;
  getAll(): Promise<Comments[]>;
}

export { ICommentaryRepository };
