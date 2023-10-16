import { CreateLikeController } from "@modules/posts/useCases/createLike/CreateReactionController";
import { DeleteLikeController } from "@modules/posts/useCases/deleteLike/DeleteReactionController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreateDislikeController } from "@modules/posts/useCases/createDislike/CreateReactionController";
import { DeleteDislikeController } from "@modules/posts/useCases/deleteDislike /DeleteReactionController";

export const dislikesRouter = Router();

const createDislikeController = new CreateDislikeController();

const deleteDislikeController = new DeleteDislikeController();

dislikesRouter.post(
  "/:id",
  ensureAuthenticated,
  createDislikeController.handle
);
dislikesRouter.delete(
  "/:id",
  ensureAuthenticated,
  deleteDislikeController.handle
);
