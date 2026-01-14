import api from "./axios";

export const createBid = (data) => {
  return api.post("/bids", data);
};

export const getBidsByGig = (gigId) => {
  if (!gigId) {
    return Promise.reject(new Error("Gig ID is required"));
  }
  return api.get(`/bids/${gigId}`);
};

export const hireBid = (bidId) => {
  return api.patch(`/bids/${bidId}/hire`);
};
