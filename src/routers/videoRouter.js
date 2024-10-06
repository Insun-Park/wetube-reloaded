import express from "express";
import {
  videoEdit,
  videoWatch,
  postEdit,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id", videoWatch);
videoRouter.route("/:id/edit").get(videoEdit).post(postEdit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
