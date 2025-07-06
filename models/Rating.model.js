import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
}, { timestamps: true });

ratingSchema.index({ store: 1, user: 1 }, { unique: true }); // Prevent multiple ratings by same user

export default mongoose.model("Rating", ratingSchema);
