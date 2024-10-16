import express from "express";
import {
  see,
  logout,
  getEdit,
  postEdit,
  userDelete,
  startGithubLogin,
  finishGithubLogin,
  getEditPassword,
  postEditPassword,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadFiles,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);
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
