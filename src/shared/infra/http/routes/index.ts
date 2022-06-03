import { Router } from "express";
import { commentsRouter } from "./comments.routes";
import { followerRouter } from "./followers.routes";
import { postRouter } from "./post.routes";
import { userRouter } from "./users.routes";

export const router = Router();

router.use("/users", userRouter);

router.use("/followers", followerRouter);

router.use("/post", postRouter);

router.use("/comments", commentsRouter);
