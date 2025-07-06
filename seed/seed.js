import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Store from "../models/Store.model.js";
import Rating from "../models/Rating.model.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clean up old data
    await Rating.deleteMany();
    await Store.deleteMany();
    await User.deleteMany();
    console.log("🧹 Old data deleted");

    // Create Users
    const admin = await User.create({
      name: "Admin User 1234567890",
      email: "admin@example.com",
      password: "Admin@123",
      address: "Admin Address",
      role: "admin",
    });

    const user1 = await User.create({
      name: "Normal User One 1234567890",
      email: "user1@example.com",
      password: "User@123",
      address: "User Address 1",
      role: "user",
    });

    const user2 = await User.create({
      name: "Normal User Two 1234567890",
      email: "user2@example.com",
      password: "User@123",
      address: "User Address 2",
      role: "user",
    });

    const storeOwner = await User.create({
      name: "Store Owner 1234567890",
      email: "owner@example.com",
      password: "Owner@123",
      address: "Owner Address",
      role: "storeOwner",
    });

    // Create Stores
    const store1 = await Store.create({
      name: "Pizza Palace",
      address: "123 Cheese Lane",
      owner: storeOwner._id,
    });

    const store2 = await Store.create({
      name: "Burger Bunker",
      address: "456 Beef Blvd",
    });

    const store3 = await Store.create({
      name: "Coffee Corner",
      address: "789 Java St",
      owner: storeOwner._id,
    });

    // Ratings
    await Rating.create([
      {
        store: store1._id,
        user: user1._id,
        score: 5,
      },
      {
        store: store1._id,
        user: user2._id,
        score: 4,
      },
      {
        store: store2._id,
        user: user1._id,
        score: 3,
      },
      {
        store: store3._id,
        user: user2._id,
        score: 5,
      },
    ]);

    console.log("✅ Seeding complete!");
    console.log("🧪 Test logins:");
    console.log("🔑 Admin:       admin@example.com / Admin@123");
    console.log("🔑 User 1:      user1@example.com / User@123");
    console.log("🔑 User 2:      user2@example.com / User@123");
    console.log("🔑 Store Owner: owner@example.com / Owner@123");

    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
