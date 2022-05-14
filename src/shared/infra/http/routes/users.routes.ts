import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const userRouter = Router();

const createUserController = new CreateUserController();

const authenticateUserController = new AuthenticateUserController();

userRouter.post("/", ensureAuthenticated, createUserController.handle);

userRouter.post("/login", authenticateUserController.handle);
