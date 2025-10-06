import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "./productsSlice";
import { FaBoxOpen, FaExclamationTriangle, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import { GoAlertFill } from "react-icons/go";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector(
    (state) => state.products || { items: [], status: "idle" }
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p className="text-center mt-10">Loading dashboard...</p>;

  // Summary calculations
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 5).length;
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const topSellingProducts = [...products].sort((a, b) => b.sold - a.sold);

  const chartData = {
    labels: topSellingProducts.map((p) => p.name),
    datasets: [
      {
        label: "Units Sold",
        data: topSellingProducts.map((p) => p.sold),
        backgroundColor: "rgba(59, 130, 246, 0.9)",
      },
    ],
  };

  const lowStockItems = products
    .filter((p) => p.stock < 5)
    .map((p) => ({ name: p.name, category: p.category, quantity: p.stock }));

  const recentActivity = [
    `New order processed (${totalSold} items sold)`,
    ...lowStockItems.map((item) => `Low stock alert: ${item.name} (${item.quantity} left)`),
  ];

  const summaryCards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FaBoxOpen size={30} />,
      bgClass: "bg-gradient-to-r from-blue-400 to-blue-600",
    },
    {
      title: "Low Stock",
      value: lowStockProducts,
      icon: <FaExclamationTriangle size={30} />,
      bgClass: "bg-gradient-to-r from-red-400 to-red-600",
    },
    {
      title: "Total Orders",
      value: totalSold,
      icon: <FaShoppingCart size={30} />,
      bgClass: "bg-gradient-to-r from-green-400 to-green-600",
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: <FaChartLine size={30} />,
      bgClass: "bg-gradient-to-r from-purple-400 to-purple-600",
    },
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.90 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <div className="space-y-6 p-4">
      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {summaryCards.map((card, idx) => (
          <motion.div
            key={idx}
            className={`${card.bgClass} text-white p-6 rounded-lg shadow-lg flex items-center gap-3 hover:shadow-xl transition`}
            variants={itemVariants}
          >
            {card.icon}
            <div>
              <h2 className="font-semibold">{card.title}</h2>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        className="w-full bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Top Selling Products</h2>
        <div className="w-full h-64">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </motion.div>

      {/* Low Stock Table */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Low Stock Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Product Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Category</th>
                <th className="px-4 py-2 text-left text-gray-600">Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No low stock items
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item, idx) => (
                  <tr key={item.name + idx} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2 text-red-600 font-semibold">{item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activity + Insights */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Recent Activity */}
        <motion.div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition" variants={itemVariants}>
          <h2 className="text-gray-800 font-semibold mb-2">Recent Activity</h2>
          <ul className="space-y-1 text-sm text-gray-700">
            {recentActivity.length === 0 ? (
              <li>No recent activity</li>
            ) : (
              recentActivity.map((act, idx) => (
                <li key={act + idx} className="flex items-center gap-2">
                  {act.includes("Low stock") ? (
                    <GoAlertFill className="text-red-600" />
                  ) : (
                    <IoMdCheckboxOutline className="text-green-600" />
                  )}
                  {act}
                </li>
              ))
            )}
          </ul>
        </motion.div>

        {/* Smart Insights */}
        <motion.div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition" variants={itemVariants}>
          <h2 className="text-gray-800 font-semibold mb-2">Smart Insights</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Top 5 products cover 80% of total sales.</li>
            <li>3 products unsold for 30+ days — check pricing.</li>
            <li>Overall stock turnover up 12% this week.</li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-center p-2 rounded text-sm text-gray-700">
        Inventory Dashboard v1.0.3 | Last updated: {new Date().toLocaleDateString()} | All rights reserved
      </div>
    </div>
  );
}
