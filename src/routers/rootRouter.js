import express from "express";
import { home, videoSearch } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", videoSearch);

export default rootRouter;
