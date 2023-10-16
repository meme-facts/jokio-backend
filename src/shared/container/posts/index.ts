import { CommentRepository } from "@modules/posts/infra/prisma/repositories/CommentRepository";
import { PostDislikesRepository } from "@modules/posts/infra/prisma/repositories/PostDislikeRepository";
import { PostLikesRepository } from "@modules/posts/infra/prisma/repositories/PostLikeRepository";
import { PostRepository } from "@modules/posts/infra/prisma/repositories/PostRepository";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { container } from "tsyringe";

container.registerSingleton<IPostRepository>("PostRepository", PostRepository);

container.registerSingleton<ICommentRepository>(
  "CommentRepository",
  CommentRepository
);

container.registerSingleton<IPostLikeRepository>(
  "PostLikesRepository",
  PostLikesRepository
);

container.registerSingleton<IPostDislikeRepository>(
  "PostDislikesRepository",
  PostDislikesRepository
);
