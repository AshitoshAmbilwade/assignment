import api from "./axios";

export const createBid = (data) => {
  return api.post("/bids", data);
};

export const getBidsByGig = (gigId) => {
  return api.get(`/bids/${gigId}`);
};

export const hireBid = (bidId) => {
  return api.patch(`/bids/${bidId}/hire`);
};
