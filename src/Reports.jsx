import React , {useMemo, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { isNodeOrChild, motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { fetchProducts } from "./productsSlice"; 


export default function Reports() {
  const products = useSelector((state) => state.products.items);
  const orders = useSelector((state) => state.orders.items);
  const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchProducts());
}, [dispatch]);

  // Calculate stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalQuantitySold = products.reduce((sum, p) => sum + p.sold, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  // Top products by sold quantity
  const topProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5); // top 5 products

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const lineData = useMemo(()=>{
    const groups = orders.reduce((acc, order)=>{
      const d = new Date(order.date);
      if(isNaN(d))return acc;
      const key = d.toISOString().slice(0, 10);
      acc[key] = (acc[key]||0) + Number(order.quantity || 0);
      return acc;
    }, {});

    const arr = Object.keys(groups)
      .map((isoDate) => ({ date: isoDate, quantity: groups[isoDate] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    
    return arr;

  }, [orders]);
  

// Top selling product
const topProduct = products.reduce((max, p) => (p.sold > max.sold ? p : max), products[0]);

// Low stock products
const lowStock = products.filter((p) => p.stock < 5);

// Total orders this week (assuming 'date' in YYYY-MM-DD)
const today = new Date();
const oneWeekAgo = new Date(today);
oneWeekAgo.setDate(today.getDate() - 7);
const weeklyOrders = orders.filter(o => new Date(o.date) >= oneWeekAgo);

// Example insights
const insights = [
  `Top selling product: ${topProduct.name} (${topProduct.sold} units sold)`,
  `Low stock products: ${lowStock.map(p => p.name).join(", ")}`,
  `Total orders this week: ${weeklyOrders.length}`,
];


  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="bg-blue-600 text-white p-4 rounded-lg shadow flex flex-col" variants={itemVariants}>
          <span className="font-semibold">Total Products</span>
          <span className="text-2xl font-bold">{totalProducts}</span>
        </motion.div>
        <motion.div className="bg-green-600 text-white p-4 rounded-lg shadow flex flex-col" variants={itemVariants}>
          <span className="font-semibold">Total Orders</span>
          <span className="text-2xl font-bold">{totalOrders}</span>
        </motion.div>
        <motion.div className="bg-purple-600 text-white p-4 rounded-lg shadow flex flex-col" variants={itemVariants}>
          <span className="font-semibold">Total Quantity Sold</span>
          <span className="text-2xl font-bold">{totalQuantitySold}</span>
        </motion.div>
        <motion.div className="bg-red-600 text-white p-4 rounded-lg shadow flex flex-col" variants={itemVariants}>
          <span className="font-semibold">Low Stock</span>
          <span className="text-2xl font-bold">{lowStockCount}</span>
        </motion.div>
      </motion.div>

      {/* Top Products Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto bg-white border rounded-lg shadow-md border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-r border-gray-200">Product</th>
              <th className="py-2 px-4 border-r border-gray-200">Category</th>
              <th className="py-2 px-4 border-r border-gray-200">Stock</th>
              <th className="py-2 px-4 border-r border-gray-200">Sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 border-r border-gray-200">{p.name}</td>
                <td className="py-2 px-4 border-r border-gray-200">{p.category}</td>
                <td className="py-2 px-4 border-r border-gray-200">{p.stock}</td>
                <td className="py-2 px-4 border-r border-gray-200">{p.sold}</td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Orders Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => new Date(d).toLocaleDateString()} // nice labels
          />
          <YAxis />
          <Tooltip labelFormatter={(d) => new Date(d).toLocaleString()} />
          <Legend />
          <Line type="monotone" dataKey="quantity" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-4 text-sm text-gray-700 leading-relaxed border-t pt-3">
    <p>
      The line chart above represents the <span className="font-semibold">daily order quantity </span>
       over a specific period. A rising trend indicates increasing demand, while a dip shows lower activity
      on those dates. This helps in understanding <span className="font-semibold">customer ordering patterns</span> and
      identifying peak business days.
    </p>
    <p className="mt-2">
      Monitoring these trends can assist in <span className="font-semibold">inventory planning</span>,
      workforce allocation, and forecasting future demand more accurately.
    </p>
  </div>
  <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
  <h3 className="font-semibold mb-2">Insights</h3>
  <ul className="list-disc list-inside text-gray-700">
    {insights.map((insight, index) => (
      <li key={index}>{insight}</li>
    ))}
  </ul>
</div>


    </div>
  );
}
