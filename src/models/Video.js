import mongoose from "mongoose";

// If I define data type to schema, Mongoose help me data validity inspection.
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, required: true, trim: true }],
  meta: {
    type: {
      views: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
    },
    required: true,
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
