import express from "express";
import {
  getMyStores,
  getRatingsForMyStore
} from "../controllers/storeOwner.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate, authorize(["storeOwner"]));

router.get("/stores", getMyStores);
router.get("/stores/:storeId/ratings", getRatingsForMyStore);

export default router;
