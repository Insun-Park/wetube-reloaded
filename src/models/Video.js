import mongoose from "mongoose";

// If I define data type to schema, Mongoose help me data validity inspection.
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 10 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, required: true, trim: true }],
  fileUrl: { type: String, required: true },
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  // "ref" is selected Model name of mongoDB
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
