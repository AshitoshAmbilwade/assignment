import api from "./axios";

export const getGigs = (search = "") => {
  const query = search ? `?search=${search}` : "";
  return api.get(`/gigs${query}`);
};

export const createGig = (data) => {
  return api.post("/gigs", data);
};
export const getBidsByGig = (gigId) => {
  return api.get(`/gigs/${gigId}/bids`);
};

export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
