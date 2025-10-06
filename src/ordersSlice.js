import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
  },
  reducers: {
    addOrders: (state, action) => {  // <-- state comes first
      state.items.push({
        id: Date.now(),
        ...action.payload,
      });
    },

    deleteOrder: (state, action) => { // <-- state comes first
      state.items = state.items.filter((order) => order.id !== action.payload);
    },

    clearOrders: (state) => {
      state.items = [];
    },
  },
});

export const { addOrders, deleteOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
