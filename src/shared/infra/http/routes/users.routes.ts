import { Router } from "express";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
import { AuthenticateUserController } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { GetAllUsersController } from "@modules/users/useCases/getAllUsers/GetAllUsersController";
import { GetUserByNickNameController } from "@modules/users/useCases/getUserById/GetUserByNickNameController";
import { UpdateUserAvatarController } from "@modules/users/useCases/updateUserAvatar/UpdateUserAvatarController";
import multer from "multer";
import uploadConfig from "../../../../config/upload";
import { CheckUsernameAvailabilityController } from "@modules/users/useCases/checkUsernameAvailability/CheckUsernameAvailabilityController";
import { CheckEmailAvailabilityController } from "@modules/users/useCases/checkEmailAvailability/CheckEmailAvailabilityController";

export const userRouter = Router();

const getAllUsersController = new GetAllUsersController();

const createUserController = new CreateUserController();

const authenticateUserController = new AuthenticateUserController();

const updateUserController = new UpdateUserController();

const getUserByNickNameController = new GetUserByNickNameController();

const updateUserAvatar = new UpdateUserAvatarController();

const checkUsernameAvailabilityController =
  new CheckUsernameAvailabilityController();

const checkEmailAvailabilityController = new CheckEmailAvailabilityController();

const uploadAvatar = multer(uploadConfig);

userRouter.get("/", ensureAuthenticated, getAllUsersController.handle);

userRouter.get(
  "/nickname/:nickname/is-available",
  ensureAuthenticated,
  checkUsernameAvailabilityController.handle
);

userRouter.get(
  "/email/:email/is-available",
  ensureAuthenticated,
  checkEmailAvailabilityController.handle
);

userRouter.get("/:id", ensureAuthenticated, getUserByNickNameController.handle);

userRouter.post("/", createUserController.handle);

userRouter.post("/login", authenticateUserController.handle);

userRouter.post("/google", authenticateUserController.google);

userRouter.put("/update", ensureAuthenticated, updateUserController.handle);

userRouter.patch(
  "/avatar",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  updateUserAvatar.handle
);
