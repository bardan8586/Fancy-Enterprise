import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Fetch full wishlist (products) for logged-in user
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return rejectWithValue({ message: "Not authenticated" });

      const { data } = await axios.get(`${API_BASE}/api/users/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to load wishlist" }
      );
    }
  }
);

// Add a product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return rejectWithValue({ message: "Not authenticated" });

      const { data } = await axios.post(
        `${API_BASE}/api/users/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add to wishlist" }
      );
    }
  }
);

// Remove a product from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return rejectWithValue({ message: "Not authenticated" });

      const { data } = await axios.delete(
        `${API_BASE}/api/users/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to remove from wishlist" }
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load wishlist";
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to wishlist";
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from wishlist";
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;


