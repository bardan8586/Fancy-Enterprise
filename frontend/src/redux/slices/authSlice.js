import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Check if stored token is expired and clear if needed
const checkTokenExpiration = () => {
  const token = localStorage.getItem("userToken");
  const userInfo = localStorage.getItem("userInfo");
  
  if (token && userInfo) {
    try {
      // Validate JWT format first (should have 3 parts separated by dots)
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      // Decode JWT payload (basic check - just check exp without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if payload has required fields
      if (!payload.exp || !payload.user) {
        throw new Error('Invalid JWT payload');
      }
      
      if (payload.exp < currentTime) {
        // Token is expired, clear it
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        return null;
      }
      
      // Validate userInfo format
      const parsedUserInfo = JSON.parse(userInfo);
      if (!parsedUserInfo._id || !parsedUserInfo.email) {
        throw new Error('Invalid user info format');
      }
      
      return parsedUserInfo;
    } catch (error) {
      // Invalid token format or corrupted data, clear everything
      console.warn('Clearing corrupted authentication data:', error.message);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cart"); // Also clear potentially corrupted cart
      localStorage.removeItem("guestId");
      return null;
    }
  }
  return null;
};

// Retrieve user info and token from localStorage if available and not expired
const userFromStorage = checkTokenExpiration();

// Check for an existing guest ID in the localStorage or generate a new One
const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
  validationErrors: null,
};

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user; // Return the user object from the response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Login failed" }
      );
    }
  }
);

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user; // Return the user object from the response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Registration failed" }
      );
    }
  }
);

// Async Thunk for Google Authentication
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/google-auth`,
        { tokenId }
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Google authentication failed" }
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId); // Set new guest ID in localStorage
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
    clearExpiredAuth: (state) => {
      // Handle token expiration gracefully
      state.user = null;
      state.error = "Your session has expired. Please log in again.";
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.validationErrors = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.validationErrors = action.payload?.errors || null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.validationErrors = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
        state.validationErrors = action.payload?.errors || null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.validationErrors = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Google authentication failed";
        state.validationErrors = null;
      });
  },
});

export const { logout, generateNewGuestId, clearExpiredAuth } = authSlice.actions;
export default authSlice.reducer;
