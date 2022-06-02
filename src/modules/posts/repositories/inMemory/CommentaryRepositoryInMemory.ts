import { ICommentaryDTO } from "@modules/posts/dtos/ICommentaryDTO";
import { ICommentaryRepository } from "../ICommentaryRepository";

class CommentaryRepositoryInMemory implements ICommentaryRepository {
  create({ userId, postId, message }: ICommentaryDTO): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
