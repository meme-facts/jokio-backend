import { CreateReactionController } from "@modules/posts/useCases/createReaction/CreateReactionController";
import { DeleteReactionController } from "@modules/posts/useCases/deleteReaction/DeleteReactionController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const reactionsRouter = Router();

const createReactionController = new CreateReactionController();

const deleteReactionController = new DeleteReactionController();

reactionsRouter.post(
  "/:id",
  ensureAuthenticated,
  createReactionController.handle
);
reactionsRouter.delete(
  "/:id",
  ensureAuthenticated,
  deleteReactionController.handle
);
