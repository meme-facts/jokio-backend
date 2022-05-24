import { Router } from "express";
import { postRouter } from "./post.routes";
import { userRouter } from "./users.routes";

export const router = Router();

router.use("/users", userRouter);

router.use("/post", postRouter);
