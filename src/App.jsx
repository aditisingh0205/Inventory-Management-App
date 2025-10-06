import { useState } from "react";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaBoxOpen, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";

import Dashboard from "./Dashboard";
import Products from "./Products";
import Orders from "./Orders";
import Reports from "./Reports";

// Header configuration for each route
const headerConfig = {
  "/dashboard": {
    icon: <LuLayoutDashboard size={50} className="text-blue-600" />,
    title: "Dashboard",
    subtitle: "Overview of your store today",
  },
  "/products": {
    icon: <FaBoxOpen size={50} className="text-green-600" />,
    title: "Products",
    subtitle: "Manage your products and inventory",
  },
  "/orders": {
    icon: <FaShoppingCart size={50} className="text-purple-600" />,
    title: "Orders",
    subtitle: "Track customer orders",
  },
  "/reports": {
    icon: <FaChartLine size={50} className="text-red-600" />,
    title: "Reports",
    subtitle: "Analyze your store performance",
  },
};

// Dynamic Header component
function Header({ sideBarOpen, setSideBarOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { icon, title, subtitle } = headerConfig[currentPath] || {};

  return (
    <header className="flex items-center justify-between bg-white shadow p-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSideBarOpen(!sideBarOpen)}
          className="md:hidden p-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          <BsMenuButtonWideFill size={22} />
        </button>
        <div className="hidden md:flex items-center gap-3">
          {icon}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="mt-1 text-gray-500 text-sm">
              {subtitle} - {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${
            sideBarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}
        >
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Inventory
          </div>
          <nav className="p-6 space-y-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded flex items-center gap-2 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <LuLayoutDashboard /> Dashboard
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block px-4 py-2 rounded flex items-center gap-2 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <FaBoxOpen /> Products
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `block px-4 py-2 rounded flex items-center gap-2 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <FaShoppingCart /> Orders
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `block px-4 py-2 rounded flex items-center gap-2 ${
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <FaChartLine /> Reports
            </NavLink>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Dynamic Header */}
          <Header sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

          {/* Routing Area */}
          <main className="flex-1 overflow-auto p-6 md:p-8 space-y-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    
  );
}
