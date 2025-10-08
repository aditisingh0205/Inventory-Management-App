import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  editProduct,
  addProduct,
} from "./productsSlice";
import { motion } from "framer-motion";
import { addOrders } from "./ordersSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const [orderQty, setOrderQty] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock: "",
    sold: "",
  });
  const [editRow, setEditRow] = useState(null);
  const [editValues, setEditValues] = useState({ stock: "", sold: "" });

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const handleDelete = (id) => dispatch(deleteProduct(id));

  const handleEdit = (product) => {
    setEditRow(product.id);
    setEditValues({ stock: product.stock, sold: product.sold });
  };

  const handleSave = (id) => {
    dispatch(
      editProduct({
        id,
        stock: Number(editValues.stock),
        sold: Number(editValues.sold),
      })
    );
    setEditRow(null);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) return;
    const newItem = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      stock: Number(newProduct.stock) || 0,
      sold: Number(newProduct.sold) || 0,
    };
    dispatch(addProduct(newItem));
    setNewProduct({ name: "", category: "", stock: "", sold: "" });
  };

  if (status === "loading")
    return <p className="text-center mt-10">Loading products...</p>;

  // Filter & sort
  let displayedProducts = [...products];
  if (categoryFilter !== "All")
    displayedProducts = displayedProducts.filter(
      (p) => p.category === categoryFilter
    );
  if (sortField === "stock")
    displayedProducts.sort((a, b) => b.stock - a.stock);
  if (sortField === "sold") displayedProducts.sort((a, b) => b.sold - a.sold);
  displayedProducts = displayedProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const handleOrder = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    if (product && quantity <= product.stock) {
      dispatch(
        addOrders({
          productName: product.name,
          quantity,
          date: new Date().toLocaleString(),
        })
      );

      dispatch(
        editProduct({
          id: productId,
          stock: product.stock - quantity,
          sold: product.sold + quantity,
        })
      );
    } else {
      alert("Product not available or insufficient stock");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + Search + Sort */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded shadow flex-1 min-w-[120px]"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded shadow"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            className="p-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition md:flex-none"
            onClick={() => setSortField("stock")}
          >
            Sort by Stock
          </button>
          <button
            className="p-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
            onClick={() => setSortField("sold")}
          >
            Sort by Sold
          </button>
        </div>
      </motion.div>

      {/* Add Product Form */}
      <motion.div
        className="flex flex-wrap gap-2 items-end"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="p-2 border rounded shadow"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="p-2 border rounded shadow"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
          className="p-2 border rounded shadow w-20"
        />
        <input
          type="number"
          placeholder="Sold"
          value={newProduct.sold}
          onChange={(e) =>
            setNewProduct({ ...newProduct, sold: e.target.value })
          }
          className="p-2 border rounded shadow w-20"
        />
        <button
          className="p-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-blue-600 text-white p-4 rounded-lg shadow flex flex-col"
          variants={itemVariants}
        >
          <span className="font-semibold">Total Products</span>
          <span className="text-2xl font-bold">{products.length}</span>
        </motion.div>
        <motion.div
          className="bg-red-600 text-white p-4 rounded-lg shadow flex flex-col"
          variants={itemVariants}
        >
          <span className="font-semibold">Low Stock</span>
          <span className="text-2xl font-bold">
            {products.filter((p) => p.stock < 5).length}
          </span>
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="overflow-x-auto overflow-y-scroll"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full table-auto bg-white border rounded-lg shadow-md border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-r border-gray-200">Name</th>
              <th className="py-2 px-4 border-r border-gray-200">Category</th>
              <th className="py-2 px-4 border-r border-gray-200">Stock</th>
              <th className="py-2 px-4 border-r border-gray-200">Sold</th>
              <th className="py-2 px-4 border-r border-gray-200">Status</th>
              <th className="py-2 px-4">Actions</th>{" "}
              {/* Last column: no right border */}
            </tr>
          </thead>

          <tbody>
            {displayedProducts.map((p) => (
              <motion.tr
                key={p.id}
                className="border-b border-gray-200 hover:bg-gray-50"
                variants={itemVariants}
              >
                <td className="py-2 px-4 border-r border-gray-200">{p.name}</td>
                <td className="py-2 px-4 border-r border-gray-200">
                  {p.category}
                </td>
                <td className="py-2 px-4 border-r border-gray-200">
                  {editRow === p.id ? (
                    <input
                      type="number"
                      value={editValues.stock}
                      onChange={(e) =>
                        setEditValues({ ...editValues, stock: e.target.value })
                      }
                      className="p-1 border rounded w-20"
                    />
                  ) : (
                    p.stock
                  )}
                </td>
                <td className="py-2 px-4 border-r border-gray-200">
                  {editRow === p.id ? (
                    <input
                      type="number"
                      value={editValues.sold}
                      onChange={(e) =>
                        setEditValues({ ...editValues, sold: e.target.value })
                      }
                      className="p-1 border rounded w-20"
                    />
                  ) : (
                    p.sold
                  )}
                </td>
                <td className="py-2 px-4 border-r border-gray-200">
                  {p.stock < 5 ? (
                    <span className="text-red-600 font-semibold">
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2 items-center">
                  {editRow === p.id ? (
                    <button
                      className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                      onClick={() => handleSave(p.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>

                  <input
                    type="number"
                    placeholder="Qty"
                    value={orderQty[p.id] || ""}
                    onChange={(e) =>
                      setOrderQty({ ...orderQty, [p.id]: e.target.value })
                    }
                    className="w-16 p-1 border rounded"
                  />
                  <button
                    onClick={() => handleOrder(p.id, Number(orderQty[p.id]))}
                    className="ml-2 p-1 bg-blue-500 text-white rounded"
                  >
                    Order
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
