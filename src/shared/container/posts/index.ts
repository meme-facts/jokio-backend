import { CommentRepository } from "@modules/posts/infra/prisma/repositories/CommentRepository";
import { PostReactionRepository } from "@modules/posts/infra/prisma/repositories/PostReactionRepository";
import { PostRepository } from "@modules/posts/infra/prisma/repositories/PostRepository";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { container } from "tsyringe";

container.registerSingleton<IPostRepository>("PostRepository", PostRepository);

container.registerSingleton<ICommentRepository>(
  "CommentRepository",
  CommentRepository
);

container.registerSingleton<IPostReactionRepository>(
  "PostReactionRepository",
  PostReactionRepository
);
