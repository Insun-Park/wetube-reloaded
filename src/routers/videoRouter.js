import express from "express";
import { videoEdit, videoWatch, deleteVideo, upload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", videoWatch);
videoRouter.get("/:id/edit", videoEdit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
