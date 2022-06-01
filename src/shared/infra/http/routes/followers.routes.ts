import { GetPendingRelationsByUserController } from "@modules/users/useCases/getPendingRelationsByUser/GetPendingRelationsByUserController";
import { RemoveRelationController } from "@modules/users/useCases/removeRelation/RemoveRelationController";
import { UnFollowController } from "@modules/users/useCases/removeRelation/UnFollowController";
import { RequestUserToFollowController } from "@modules/users/useCases/requestUserToFollow/RequestUserToFollowController";
import { UpdateFollowerStatusController } from "@modules/users/useCases/updateFollowerStatus/UpdateFollowerStatusController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const followerRouter = Router();

const requestUserToFollowController = new RequestUserToFollowController();
const updateFollowerStatusController = new UpdateFollowerStatusController();
const removeRelationController = new RemoveRelationController();
const unFollowController = new UnFollowController();
const getPendingRelationsByUserController =
  new GetPendingRelationsByUserController();

followerRouter.get(
  "/",
  ensureAuthenticated,
  getPendingRelationsByUserController.handle
);

followerRouter.post(
  "/:id",
  ensureAuthenticated,
  requestUserToFollowController.handle
);
followerRouter.put(
  "/",
  ensureAuthenticated,
  updateFollowerStatusController.handle
);
followerRouter.delete(
  "/:id",
  ensureAuthenticated,
  removeRelationController.handle
);
followerRouter.delete(
  "/:id/unfollow",
  ensureAuthenticated,
  unFollowController.handle
);
