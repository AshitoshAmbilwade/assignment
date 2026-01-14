import express from "express";
import {
  createBid,
  getBidsForGig,
  hireBid,
} from "../controllers/bid.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
//import { hireBid } from "../controllers/hire.controller.js";

const router = express.Router();

// Submit a bid
router.post("/", protect, createBid);

// Get bids for a gig (owner only)
router.get("/:gigId", protect, getBidsForGig);

// Hire a freelancer (atomic)
router.patch("/:bidId/hire", protect, hireBid);

export default router;
