import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteOrder } from "./ordersSlice";
import { motion } from "framer-motion";

export default function Orders() {
  const orders = useSelector((state) => state.orders.items);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteOrder(id));
  };

  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);

  // Framer Motion variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="bg-blue-600 text-white p-4 rounded-lg shadow flex flex-col max-w-xs" variants={cardVariants}>
          <span className="font-semibold">Total Orders</span>
          <span className="text-2xl font-bold">{orders.length}</span>
        </motion.div>
        <motion.div className="bg-green-600 text-white p-4 rounded-lg shadow flex flex-col max-w-xs" variants={cardVariants}>
          <span className="font-semibold">Total Quantity</span>
          <span className="text-2xl font-bold">{totalQuantity}</span>
        </motion.div>
      </motion.div>

      {/* Orders Table */}
      <div className="overflow-x-auto overflow-y-scroll scrollbar-hide">
        <table className="min-w-full table-auto bg-white border rounded-lg shadow-md border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-r border-gray-200">Product</th>
              <th className="py-2 px-4 border-r border-gray-200">Quantity</th>
              <th className="py-2 px-4 border-r border-gray-200">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No orders yet
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <motion.tr
                key={order.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-2 px-4 border-r border-gray-200">{order.productName}</td>
                <td className="py-2 px-4 border-r border-gray-200">{order.quantity}</td>
                <td className="py-2 px-4 border-r border-gray-200">{order.date}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
