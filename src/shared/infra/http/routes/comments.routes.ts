import { CreateCommentaryController } from "@modules/posts/useCases/createComment/CreateCommentController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const commentsRouter = Router();

const createCommentaryController = new CreateCommentaryController();

commentsRouter.post(
  "/:id",
  ensureAuthenticated,
  createCommentaryController.handle
);
