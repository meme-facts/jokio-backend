import { CreatePostController } from "@modules/posts/useCases/createPost/CreatePostController";
import { ReturnPostController } from "@modules/posts/useCases/returnPosts/ReturnPostController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const postRouter = Router();

const createPostController = new CreatePostController();

const returnPosts = new ReturnPostController();

postRouter.post("/", ensureAuthenticated, createPostController.handle);

postRouter.get("/", ensureAuthenticated, returnPosts.handle);
