import { Router } from "express";
import { commentsRouter } from "./comments.routes";
import { followerRouter } from "./followers.routes";
import { postRouter } from "./post.routes";
import { userRouter } from "./users.routes";
import { likesRouter } from "./likes.routes";
import { dislikesRouter } from "./dislike.routes";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { messageRouter } from "./messages.routes";

export const router = Router();

router.use("/users", userRouter);

router.use("/followers", followerRouter);

router.use("/post", postRouter);

router.use("/comments", commentsRouter);

router.use("/like", likesRouter);

router.use("/dislike", dislikesRouter);

router.use("/messages", ensureAuthenticated, messageRouter);
