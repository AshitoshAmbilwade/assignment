import express from "express";
import { getGigs, createGig,getBidsForGig, getGigById } from "../controllers/gig.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: browse gigs
router.get("/", getGigs);

router.get("/:gigId/bids", getBidsForGig);

router.get("/:id", protect, getGigById);

// Protected: create gig
router.post("/", protect, createGig);

export default router;
