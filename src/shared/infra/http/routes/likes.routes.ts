import { CreateLikeController } from "@modules/posts/useCases/createLike/CreateReactionController";
import { DeleteLikeController } from "@modules/posts/useCases/deleteLike/DeleteReactionController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const likesRouter = Router();

const createLikeController = new CreateLikeController();

const deleteLikeController = new DeleteLikeController();

likesRouter.post("/:id", ensureAuthenticated, createLikeController.handle);

likesRouter.delete("/:id", ensureAuthenticated, deleteLikeController.handle);
