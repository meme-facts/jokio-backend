import { CreatePostController } from "@modules/posts/useCases/createPost/CreatePostController";
import { ReturnPostController } from "@modules/posts/useCases/returnPosts/ReturnPostController";
import { ReturnPostByUserController } from "@modules/posts/useCases/returnPostsByUser/ReturnPostByUserController";

import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ReturnPostByIdController } from "@modules/posts/useCases/returnPostById/ReturnPostByIdController";
import { SharePostWithMultipleUsersController } from "@modules/posts/useCases/sharePostWithMultipleUsers/SharePostWithMultipleUsersController";
import { ReturnPostByUserNicknameController } from "@modules/posts/useCases/returnPostsByUserNickname/ReturnPostByUserNicknameController";

export const postRouter = Router();

const createPostController = new CreatePostController();

const returnPostsByUserController = new ReturnPostByUserController();

const returnPostByUserIdController = new ReturnPostByUserNicknameController();

const returnPostByUserId = new ReturnPostByIdController();

const returnPosts = new ReturnPostController();

const sharePostWithMultipleUsers = new SharePostWithMultipleUsersController();

postRouter.post("/", ensureAuthenticated, createPostController.handle);

postRouter.get(
  "/following",
  ensureAuthenticated,
  returnPostsByUserController.handle
);

postRouter.get("/", ensureAuthenticated, returnPosts.handle);

postRouter.get(
  "/:nickname",
  ensureAuthenticated,
  returnPostByUserIdController.handle
);

postRouter.get("/detail/:id", ensureAuthenticated, returnPostByUserId.handle);

postRouter.post(
  "/share/:id",
  ensureAuthenticated,
  sharePostWithMultipleUsers.handle
);
