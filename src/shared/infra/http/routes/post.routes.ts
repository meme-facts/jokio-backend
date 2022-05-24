import { CreatePostController } from "@modules/posts/useCases/createPost/CreatePostController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";


export const postRouter = Router();

const createPostController = new CreatePostController();

postRouter.post('/',ensureAuthenticated, createPostController.handle);