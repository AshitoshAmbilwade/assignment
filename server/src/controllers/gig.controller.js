import Gig from "../models/Gig.js";

// GET /api/gigs
export const getGigs = async (req, res) => {
  const { search, status } = req.query;

  const query = {};

  if (status) query.status = status; // optional filter
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const gigs = await Gig.find(query)
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 });

  res.json(gigs);
};


// POST /api/gigs
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // Basic validation
    if (!title || !description || !budget) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id, // from auth middleware
    });

    res.status(201).json({
      message: "Gig created successfully",
      gig,
    });
  } catch (error) {
    console.error("Create gig error:", error);
    res.status(500).json({
      message: "Server error",
    });
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
      "_id name"
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    // ✅ ALWAYS same response shape
    res.json({
      gig: {
        _id: gig._id,
        title: gig.title,
        status: gig.status,
        ownerId: gig.ownerId._id.toString(),
      },
      bids,
    });
  } catch (error) {
    console.error("Get bids error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/gigs/:id
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("ownerId", "name email");

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


