import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (gender) query.append("gender", gender);
    if (color) query.append("color", color);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );

    return response.data;
  }
);

//make a async thunk to fetch a single product by ID:
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

// make async thunk to fetch similar products to the selected one
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //hanlde fetching single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //hanlde fetching similar product
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })

      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
