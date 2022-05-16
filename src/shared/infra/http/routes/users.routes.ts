import { Router } from "express";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
import { AuthenticateUserController } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const userRouter = Router();

const createUserController = new CreateUserController();

const authenticateUserController = new AuthenticateUserController();

const updateUserController = new UpdateUserController();

userRouter.post("/", ensureAuthenticated, createUserController.handle);

userRouter.post("/login", authenticateUserController.handle);

userRouter.put("/update", updateUserController.handle);
