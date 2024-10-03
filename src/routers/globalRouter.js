import express from "express";
import { trendVideos, videoSearch } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", trendVideos);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", videoSearch);

export default globalRouter;
