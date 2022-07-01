import { CreatePostController } from "@modules/posts/useCases/createPost/CreatePostController";
import { ReturnPostController } from "@modules/posts/useCases/returnPosts/ReturnPostController";
import { ReturnPostByUserController } from "@modules/posts/useCases/returnPostsByUser/ReturnPostByUserController";
import { ReturnPostByUserIdController } from "@modules/posts/useCases/returnPostsByUserId/ReturnPostByUserIdController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const postRouter = Router();

const createPostController = new CreatePostController();

const returnPostsByUserController = new ReturnPostByUserController();

const returnPostByUserIdController = new ReturnPostByUserIdController();

const returnPosts = new ReturnPostController();

postRouter.post("/", ensureAuthenticated, createPostController.handle);

postRouter.get(
  "/following",
  ensureAuthenticated,
  returnPostsByUserController.handle
);

postRouter.get("/", ensureAuthenticated, returnPosts.handle);

postRouter.get(
  "/:id",
  ensureAuthenticated,
  returnPostByUserIdController.handle
);
