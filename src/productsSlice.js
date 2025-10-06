import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("https://mocki.io/v1/83da4c59-11db-4ea9-abb5-8ff6616cf78a");
    const data = await response.json();
    return data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    orders: [],
  },
  reducers: {
  deleteProduct: (state, action) => {
    state.items = state.items.filter((p) => p.id !== action.payload);
  },
  editProduct: (state, action) => {
    const { id, stock, sold } = action.payload;
    state.items = state.items.map((p) =>
      p.id === id ? { ...p, stock, sold } : p
    );
  },
  addProduct: (state, action) => {
    state.items.push(action.payload);
  },
  addOrders: (state,action) =>{
    const{productId, quantity} = action.payload;
    const product = state.items.find((p)=> p.id===productId);
    
  }
},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.items = action.payload.map((item, index) => ({
    ...item,
    id: item.id || index + 1,
  }));
})

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { deleteProduct, editProduct, addProduct } = productsSlice.actions;
export default productsSlice.reducer;
