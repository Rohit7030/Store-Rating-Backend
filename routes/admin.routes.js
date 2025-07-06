import express from "express";
import {
  addUser,
  addStore,
  getStats,
  getUsers,
  getStores,
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorize(["admin"]));

router.post("/users", addUser);
router.post("/stores", addStore);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/stores", getStores);

export default router;
