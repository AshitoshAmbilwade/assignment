import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gigApi } from "../api";

// Fetch all open gigs
export const fetchGigs = createAsyncThunk(
  "gigs/fetchAll",
  async (search = "", { rejectWithValue }) => {
    try {
      const res = await gigApi.getGigs(search);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch gigs"
      );
    }
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gigSlice.reducer;
