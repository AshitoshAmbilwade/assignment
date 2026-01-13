import api from "./axios";

export const getGigs = (search = "") => {
  const query = search ? `?search=${search}` : "";
  return api.get(`/gigs${query}`);
};

export const createGig = (data) => {
  return api.post("/gigs", data);
};
