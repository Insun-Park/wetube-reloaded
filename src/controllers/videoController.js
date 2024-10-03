export const trendVideos = (req, res) => {
  const video = [
    {
      title: "1st Video",
      rating: 4,
      comments: 43,
      createdAt: "2 hours ago",
      views: 234,
    },
    {
      title: "Begin Again",
      rating: 5,
      comments: 43,
      createdAt: "2 hours ago",
      views: 234,
    },
    {
      title: "All or Nothing - Arsenal",
      rating: 5,
      comments: 413,
      createdAt: "2 hours ago",
      views: 232214,
    },
    {
      title: "Final Video",
      rating: 2,
      comments: 3,
      createdAt: "2 minutes ago",
      views: 45234,
    },
  ];
  return res.render("home", { pageTitle: "Home", video });
};
export const videoWatch = (req, res) =>
  res.render("watch", { videoNum: `${req.params.id}` });
export const videoEdit = (req, res) => {
  console.log(req.params);
  const videoNum = req.params.id;
  return res.send(`Editing ${videoNum} Videos!`);
};
export const videoSearch = (req, res) => res.send("Search Videos");
export const deleteVideo = (req, res) => {
  console.log(req.params);
  const videoNum = req.params.id;
  return res.send(`Delete ${videoNum}th Videos`);
};
export const upload = (req, res) => res.send("Upload Video");
