import { CreateCommentController } from "@modules/posts/useCases/createComment/CreateCommentController";
import { DeleteCommentController } from "@modules/posts/useCases/deleteComment/DeleteCommentController";
import { UpdateCommentController } from "@modules/posts/useCases/updateComment/UpdateCommentController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ReturnCommentsController } from "@modules/posts/useCases/returnComments/ReturnCommentsController";

export const commentsRouter = Router();

const createCommentaryController = new CreateCommentController();
const deleteCommentController = new DeleteCommentController();
const updateCommentController = new UpdateCommentController();
const returnCommentsController = new ReturnCommentsController();

commentsRouter.post(
  "/:id",
  ensureAuthenticated,
  createCommentaryController.handle
);
commentsRouter.put("/:id", ensureAuthenticated, updateCommentController.handle);

commentsRouter.get(
  "/:id",
  ensureAuthenticated,
  returnCommentsController.handle
);

commentsRouter.put("/:id", ensureAuthenticated, updateCommentController.handle);

commentsRouter.delete(
  "/:id",
  ensureAuthenticated,
  deleteCommentController.handle
);
