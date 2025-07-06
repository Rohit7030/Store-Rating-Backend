import Rating from "../models/Rating.model.js";
import Store from "../models/Store.model.js";

// Submit new rating
export const submitRating = async (req, res) => {
  try {
    const { storeId, score } = req.body;
    const userId = req.user._id;

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    const existing = await Rating.findOne({ store: storeId, user: userId });
    if (existing) {
      return res.status(400).json({ message: "Rating already submitted" });
    }

    const rating = await Rating.create({ store: storeId, user: userId, score });
    res.status(201).json({ message: "Rating submitted", rating });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit rating", error: err.message });
  }
};

// Update rating
export const updateRating = async (req, res) => {
  try {
    const { score } = req.body;
    const { storeId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findOne({ store: storeId, user: userId });
    if (!rating) return res.status(404).json({ message: "Rating not found" });

    rating.score = score;
    await rating.save();

    res.json({ message: "Rating updated", rating });
  } catch (err) {
    res.status(500).json({ message: "Failed to update rating", error: err.message });
  }
};

// Get all stores (with overall rating & user's rating)
export const getAllStoresForUser = async (req, res) => {
  try {
    const { name = "", address = "" } = req.query;
    const userId = req.user._id;

    const stores = await Store.find({
      name: new RegExp(name, "i"),
      address: new RegExp(address, "i")
    });

    const results = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({ store: store._id });
        const avgRating = ratings.length
          ? (ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length).toFixed(2)
          : "N/A";

        const userRating = await Rating.findOne({ store: store._id, user: userId });

        return {
          ...store.toObject(),
          avgRating,
          userRating: userRating?.score || null
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stores", error: err.message });
  }
};
