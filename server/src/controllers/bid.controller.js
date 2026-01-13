import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

// POST /api/bids
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found",
      });
    }

    // Cannot bid on own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot bid on your own gig",
      });
    }

    // Cannot bid on assigned gig
    if (gig.status === "assigned") {
      return res.status(400).json({
        message: "This gig is already assigned",
      });
    }

    // Optional but impressive: prevent duplicate bids
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
    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET /api/bids/:gigId
export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found",
      });
    }

    // Only gig owner can view bids
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to view bids for this gig",
      });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error("Get bids error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
