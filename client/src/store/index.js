import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import gigReducer from "./gig.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigReducer,
  },
});

export default store;
