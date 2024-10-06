import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const videoWatch = (req, res) => {
  const videos = Video.find({});
  return res.render("watch", {
    pageTitle: `watching `,
    videos,
  });
};

export const videoEdit = (req, res) => {
  const id = req.params.id;
  return res.render("edit", {
    pageTitle: "Editing",
  });
};

export const postEdit = (req, res) => {
  const { title } = req.body;
  return res.redirect(`/`);
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
