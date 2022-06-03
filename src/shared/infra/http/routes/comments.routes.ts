import { CreateCommentaryController } from "@modules/posts/useCases/createCommentary/CreateCommentaryController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const commentsRouter = Router();

const createCommentaryController = new CreateCommentaryController();

commentsRouter.post(
  "/:id",
  ensureAuthenticated,
  createCommentaryController.handle
);
