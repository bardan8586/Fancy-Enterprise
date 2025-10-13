import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts, deleteProduct } from "../../redux/slices/adminProductSlice";
import { toast } from "sonner";
import { FaEdit, FaTrash, FaPlus, FaEye, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.adminProducts);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    const matchesStock = filterStock === "all" ||
                         (filterStock === "inStock" && product.countInStock > 0) ||
                         (filterStock === "outOfStock" && product.countInStock === 0) ||
                         (filterStock === "lowStock" && product.countInStock > 0 && product.countInStock < 10);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.category))];

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  // Get stock status
  const getStockStatus = (count) => {
    if (count === 0) return { text: "Out of Stock", color: "text-red-600 bg-red-100" };
    if (count < 10) return { text: "Low Stock", color: "text-yellow-600 bg-yellow-100" };
    return { text: "In Stock", color: "text-green-600 bg-green-100" };
  };

  // Statistics
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.countInStock > 0).length;
  const outOfStockCount = products.filter(p => p.countInStock === 0).length;
  const featuredCount = products.filter(p => p.isFeatured).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.countInStock), 0);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-sm text-gray-600">
            Manage your product inventory and catalog
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <FaBox className="text-3xl text-blue-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{inStockCount}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <FaTimesCircle className="text-3xl text-red-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-purple-600">{featuredCount}</p>
              </div>
              <FaCheckCircle className="text-3xl text-purple-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {!loading && products.length > 0 && (
        <div className="p-4 mb-6 bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Stock Status
              </label>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Products</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock (&lt; 10)</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          {searchTerm || filterCategory !== "all" || filterStock !== "all" ? (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          ) : null}
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <FaBox className="mx-auto mb-4 text-5xl text-gray-300" />
              <p className="mb-2 text-lg font-medium">
                {products.length === 0 ? "No products yet" : "No products match your filters"}
              </p>
              <p className="text-sm text-gray-400">
                {products.length === 0 ? (
                  <>Add your first product to get started</>
                ) : (
                  <>Try adjusting your search or filters</>
                )}
              </p>
            </div>
          ) : (
            <table className="min-w-full text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.countInStock);
                  
                  return (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <img
                          src={product.images?.[0]?.url || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          className="object-cover w-12 h-12 rounded"
                        />
                      </td>
                      
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand || 'N/A'}</p>
                          {product.isFeatured && (
                            <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            ${product.price.toFixed(2)}
                          </p>
                          {product.discountPrice && (
                            <p className="text-xs text-gray-500 line-through">
                              ${product.discountPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm">{product.sku}</span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                          <p className="mt-1 text-xs text-gray-600">
                            Qty: {product.countInStock}
                          </p>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <span className="text-sm">{product.category}</span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          product.isPublished 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-gray-700 bg-gray-100'
                        }`}>
                          {product.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/product/${product._id}`}
                            target="_blank"
                            className="p-2 text-blue-600 transition-colors hover:bg-blue-50 rounded"
                            title="View Product"
                          >
                            <FaEye />
                          </Link>
                          
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="p-2 text-yellow-600 transition-colors hover:bg-yellow-50 rounded"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 text-red-600 transition-colors hover:bg-red-50 rounded"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Displaying {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
