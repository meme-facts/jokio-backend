import { RequestUserToFollowController } from "@modules/users/useCases/requestUserToFollow/RequestUserToFollowController";
import { UpdateFollowerStatusController } from "@modules/users/useCases/updateFollowerStatus/UpdateFollowerStatusController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const followerRouter = Router();

const requestUserToFollowController = new RequestUserToFollowController();
const updateFollowerStatusController = new UpdateFollowerStatusController();

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
