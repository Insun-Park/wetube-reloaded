import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  userDelete,
  startGithubLogin,
  finishGithubLogin,
  getEditPassword,
  postEditPassword,
  see,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadAvatar,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadAvatar.single("avatar"), postEdit);
userRouter
  .route("/edit-password")
  .all(protectorMiddleware)
  .get(getEditPassword)
  .post(postEditPassword);
userRouter.get("/delete", userDelete);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
