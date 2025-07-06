import User from "../models/User.model.js";
import Store from "../models/Store.model.js";
import Rating from "../models/Rating.model.js";

// Add new user (default role = user)
export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role = "user" } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, address, role });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
};

// Add new store
export const addStore = async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;

    const store = new Store({ name, address });

    if (ownerId) {
      const owner = await User.findById(ownerId);
      if (!owner) return res.status(404).json({ message: "Owner not found" });

      owner.role = "storeOwner";
      await owner.save();
      store.owner = owner._id;
    }

    await store.save();
    res.status(201).json({ message: "Store created", store });
  } catch (err) {
    res.status(500).json({ message: "Failed to create store", error: err.message });
  }
};

// Dashboard total user, stores, rating
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

// List users with filters
export const getUsers = async (req, res) => {
  try {
    const { name = "", email = "", role = "", address = "" } = req.query;

    const users = await User.find({
      name: new RegExp(name, "i"),
      email: new RegExp(email, "i"),
      address: new RegExp(address, "i"),
      role: role ? role : { $exists: true }
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// List stores with filters
export const getStores = async (req, res) => {
  try {
    const { name = "", address = "" } = req.query;

    const stores = await Store.find({
      name: new RegExp(name, "i"),
      address: new RegExp(address, "i")
    }).populate("owner", "name email role");

    // Include average rating and number of ratings
    const storesWithRating = await Promise.all(stores.map(async store => {
      const ratings = await Rating.find({ store: store._id });
      const avgRating = ratings.length
        ? (ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length).toFixed(2)
        : "N/A";

      return { ...store.toObject(), avgRating, ratingCount: ratings.length };
    }));

    res.json(storesWithRating);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stores", error: err.message });
  }
};
