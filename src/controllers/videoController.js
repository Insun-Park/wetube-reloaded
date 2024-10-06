import Video from "../models/Video";

export const home = async (req, res) => {
  const video = await Video.find({});
  return res.render("home", { pageTitle: "Home", video });
};

export const videoWatch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
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
  const video = await Video.findById(id);
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
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  } else {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`)),
    });
    return res.redirect(`/videos/${id}`);
  }
};

export const deleteVideo = (req, res) => {
  console.log(req.params);
  const videoNum = req.params.id;
  return res.send(`Delete ${videoNum}th Videos`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect(`/`);
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const videoSearch = (req, res) => res.send("Search Videos");