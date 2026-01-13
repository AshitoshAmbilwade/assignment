import express from "express";
import authRoutes from "./auth.routes.js";
import gigRoutes from "./gig.routes.js";
import bidRoutes from "./bid.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/gigs", gigRoutes);
router.use("/bids", bidRoutes);

// Optional API root
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "GigFlow API running",
  });
});

export default router;
