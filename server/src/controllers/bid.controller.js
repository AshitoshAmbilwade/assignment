import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import mongoose from "mongoose";
// POST /api/bids
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || price === undefined || price === null) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({ message: "Invalid gig ID" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot bid on your own gig",
      });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({
        message: "This gig is already assigned",
      });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({
        message: "You have already placed a bid on this gig",
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    res.status(201).json({
      message: "Bid submitted successfully",
      bid,
    });
  } catch (error) {
    console.error("Create bid error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/bids/:gigId
export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({ message: "Invalid gig id" });
    }

    const gig = await Gig.findById(gigId).populate(
      "ownerId",
      "name email"
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      gig,
      bids,
      isOwner: String(gig.ownerId._id) === String(req.user._id),
      userId: req.user._id,
    });
  } catch (error) {
    console.error("Get bids error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


