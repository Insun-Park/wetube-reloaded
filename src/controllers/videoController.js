import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  const video = await Video.find({}).sort({ createdAt: 1 });
  return res.render("home", { pageTitle: "Home", video });
};

export const videoWatch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (video) {
    return res.render("watch", {
      pageTitle: video.title,
      video,
    });
  } else {
    return res.render("404", { pageTitle: "Video not found." });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (String(video.owner) !== String(_id)) {
    // <- add notification
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  } else {
    return res.render("edit", {
      pageTitle: video.title,
      video,
    });
  }
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (String(video.owner) !== String(_id)) {
    // <- add notification
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  } else {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    // <- add notification
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const file = req.file;
  // ES6 -> const {path: fileUrl} = req.file
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: file.path,
      // ES6 -> fileUrl,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const videoSearch = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
