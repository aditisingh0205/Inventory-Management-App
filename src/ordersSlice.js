import { createSlice } from "@reduxjs/toolkit";
const initialOrders =  [
  { id: 1, productId: 1, productName: "Shirt", quantity: 5, date: "2025-09-29" },
  { id: 2, productId: 2, productName: "Shoes", quantity: 3, date: "2025-09-30" },
  { id: 3, productId: 3, productName: "Jeans", quantity: 8, date: "2025-10-01" },
  { id: 4, productId: 4, productName: "Hat", quantity: 2, date: "2025-10-01" },
  { id: 5, productId: 5, productName: "Jacket", quantity: 6, date: "2025-10-02" },
  { id: 6, productId: 6, productName: "Socks", quantity: 4, date: "2025-10-02" },
  { id: 7, productId: 7, productName: "Belt", quantity: 3, date: "2025-10-03" },
  { id: 8, productId: 8, productName: "Watch", quantity: 1, date: "2025-10-03" },
  { id: 9, productId: 9, productName: "Bag", quantity: 5, date: "2025-10-04" },
  { id: 10, productId: 10, productName: "Gloves", quantity: 2, date: "2025-10-04" },
  { id: 11, productId: 1, productName: "Shirt", quantity: 3, date: "2025-10-05" },
  { id: 12, productId: 2, productName: "Shoes", quantity: 4, date: "2025-10-05" },
  { id: 13, productId: 3, productName: "Jeans", quantity: 2, date: "2025-10-06" },
]




const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: initialOrders,
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
