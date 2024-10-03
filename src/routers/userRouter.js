import express from "express";
import { see, logout, userEdit, userDelete } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", userEdit);
userRouter.get("/delete", userDelete);
userRouter.get("/:id", see);

export default userRouter;
