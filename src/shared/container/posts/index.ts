import { CommentRepository } from "@modules/posts/infra/prisma/repositories/CommentRepository";
import { PostDislikesRepository } from "@modules/posts/infra/prisma/repositories/PostDislikeRepository";
import { PostLikesRepository } from "@modules/posts/infra/prisma/repositories/PostLikeRepository";
import { PostRepository } from "@modules/posts/infra/prisma/repositories/PostRepository";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { container } from "tsyringe";
import { EPostRepositories } from "./post.enum";

container.registerSingleton<IPostRepository>(
  EPostRepositories.PostRepository,
  PostRepository
);

container.registerSingleton<ICommentRepository>(
  EPostRepositories.CommentRepository,
  CommentRepository
);

container.registerSingleton<IPostLikeRepository>(
  EPostRepositories.PostLikesRepository,
  PostLikesRepository
);

container.registerSingleton<IPostDislikeRepository>(
  EPostRepositories.PostDislikesRepository,
  PostDislikesRepository
);
