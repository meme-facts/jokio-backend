import { CommentaryRepository } from "@modules/posts/infra/typeorm/repositories/CommentaryRepository";
import { PostRepository } from "@modules/posts/infra/typeorm/repositories/PostRepository";
import { ICommentaryRepository } from "@modules/posts/repositories/ICommentaryRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { container } from "tsyringe";

container.registerSingleton<IPostRepository>("PostRepository", PostRepository);

container.registerSingleton<ICommentaryRepository>(
  "CommentaryRepository",
  CommentaryRepository
);
