import { GetPendingRelationsByUserController } from "@modules/users/useCases/getPendingRelationsByUser/GetPendingRelationsByUserController";
import { RemoveRelationController } from "@modules/users/useCases/removeRelation/RemoveRelationController";
import { UnFollowController } from "@modules/users/useCases/removeRelation/UnFollowController";
import { RequestUserToFollowController } from "@modules/users/useCases/requestUserToFollow/RequestUserToFollowController";
import { UpdateFollowerStatusController } from "@modules/users/useCases/updateFollowerStatus/UpdateFollowerStatusController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { UpdateFollowersStatusValidator } from "../middlewares/helpers/validators/followers/UpdateFollowersStatusValidator";
import { GetFollowersByUserController } from "@modules/users/useCases/getFollowers/getFollowingByUserController";
import { GetFollowingByUserController } from "@modules/users/useCases/getFollowing/getFollowingByUserController";

export const followerRouter = Router();

const requestUserToFollowController = new RequestUserToFollowController();
const updateFollowerStatusController = new UpdateFollowerStatusController();
const removeRelationController = new RemoveRelationController();
const unFollowController = new UnFollowController();
const getPendingRelationsByUserController =
  new GetPendingRelationsByUserController();
const getFollowersByUserController = new GetFollowersByUserController();
const getFollowingByUserController = new GetFollowingByUserController();

followerRouter.get(
  "/",
  ensureAuthenticated,
  getPendingRelationsByUserController.handle
);

followerRouter.get(
  "/:id/followers",
  ensureAuthenticated,
  getFollowersByUserController.handle
);
followerRouter.get(
  "/:id/following",
  ensureAuthenticated,
  getFollowingByUserController.handle
);

followerRouter.post(
  "/:id",
  ensureAuthenticated,
  requestUserToFollowController.handle
);
followerRouter.put(
  "/",
  ensureAuthenticated,
  UpdateFollowersStatusValidator,
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
