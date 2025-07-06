import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    maxlength: 400,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Assigned by admin
  },
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
