import Gig from "../models/Gig.js";

// GET /api/gigs
export const getGigs = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      status: "open",
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const gigs = await Gig.find(query)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error("Get gigs error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
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
