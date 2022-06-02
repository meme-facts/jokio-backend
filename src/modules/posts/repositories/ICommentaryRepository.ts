import { ICommentaryDTO } from "../dtos/ICommentaryDTO";

interface ICommentaryRepository {
  create({ userId, postId, message }: ICommentaryDTO): Promise<void>;
}

export { ICommentaryRepository };
