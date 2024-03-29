import { Router } from "express";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
import { AuthenticateUserController } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { GetAllUsersController } from "@modules/users/useCases/getAllUsers/GetAllUsersController";
import { GetUserByNickNameController } from "@modules/users/useCases/getUserById/GetUserByNickNameController";

export const userRouter = Router();

const getAllUsersController = new GetAllUsersController();

const createUserController = new CreateUserController();

const authenticateUserController = new AuthenticateUserController();

const updateUserController = new UpdateUserController();

const getUserByNickNameController = new GetUserByNickNameController();

userRouter.get("/", ensureAuthenticated, getAllUsersController.handle);

userRouter.get("/:id", ensureAuthenticated, getUserByNickNameController.handle);

userRouter.post("/", createUserController.handle);

userRouter.post("/login", authenticateUserController.handle);

userRouter.post("/google", authenticateUserController.google);

userRouter.put("/update", ensureAuthenticated, updateUserController.handle);
