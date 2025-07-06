import Store from "../models/Store.model.js";
import Rating from "../models/Rating.model.js";

// Get all stores owned by current user
export const getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.user._id });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your stores", error: err.message });
  }
};

// Get ratings for a specific store owned by current user
export const getRatingsForMyStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store || store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to access this store's ratings" });
    }

    const ratings = await Rating.find({ store: storeId }).populate("user", "name email");
    const avgRating = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(2)
      : "N/A";

    res.json({ store: store.name, avgRating, ratings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ratings", error: err.message });
  }
};
