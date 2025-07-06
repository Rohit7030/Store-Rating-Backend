import express from "express";
import {
  submitRating,
  updateRating,
  getAllStoresForUser
} from "../controllers/rating.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorize(["user"]));

router.get("/stores", getAllStoresForUser);
router.post("/", submitRating);
router.put("/:storeId", updateRating);

export default router;
