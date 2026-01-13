import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { getIO } from "../config/socket.js";

export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // 1. Fetch bid
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      throw new Error("Bid not found");
    }

    // 2. Fetch gig & validate ownership + status
    const gig = await Gig.findOne({
      _id: bid.gigId,
      ownerId: req.user._id,
      status: "open",
    }).session(session);

    if (!gig) {
      throw new Error("Gig already assigned or not authorized");
    }

    // 3. Assign gig
    gig.status = "assigned";
    await gig.save({ session });

    // 4. Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    // 5. Reject all other bids
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
      },
      { status: "rejected" },
      { session }
    );

    // 6. Commit transaction FIRST
    await session.commitTransaction();
    session.endSession();

    // 7. 🔔 Emit real-time notification (AFTER commit)
    const io = getIO();
    io.to(bid.freelancerId.toString()).emit("hired", {
      gigId: gig._id,
      gigTitle: gig.title,
      message: `You have been hired for ${gig.title}`,
    });

    // 8. Response
    res.json({
      message: "Freelancer hired successfully",
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      message: error.message,
    });
  }
};
