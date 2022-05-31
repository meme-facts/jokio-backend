import { RequestUserToFollowController } from "@modules/users/useCases/requestUserToFollow/RequestUserToFollowController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";


export const followerRouter = Router();

const requestUserToFollowController = new RequestUserToFollowController();

followerRouter.post('/', ensureAuthenticated, requestUserToFollowController.handle)