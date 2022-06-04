import { CreateCommentController } from "@modules/posts/useCases/createComment/CreateCommentController";
import { DeleteCommentController } from "@modules/posts/useCases/deleteComment/DeleteCommentController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const commentsRouter = Router();

const createCommentaryController = new CreateCommentController();
const deleteCommentController = new DeleteCommentController();

commentsRouter.post(
  "/:id",
  ensureAuthenticated,
  createCommentaryController.handle
);

commentsRouter.delete(
  "/:id",
  ensureAuthenticated,
  deleteCommentController.handle
);
