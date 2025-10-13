import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, updateProduct } from "../../redux/slices/productsSlice";
import { createProduct } from "../../redux/slices/adminProductSlice";
import { toast } from "sonner";
import { FaArrowLeft, FaSave, FaSpinner, FaPlus, FaUpload, FaTimes } from "react-icons/fa";

const EditProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Determine if we're in CREATE or EDIT mode
  const isCreateMode = location.pathname.includes('/create');
  
  const { selectedProduct, loading } = useSelector((state) => state.products);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
    isFeatured: false,
    isPublished: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data only in EDIT mode
  useEffect(() => {
    if (!isCreateMode && id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id, isCreateMode]);

  // Populate form when product data is loaded (EDIT mode only)
  useEffect(() => {
    if (!isCreateMode && selectedProduct && selectedProduct._id === id) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        discountPrice: selectedProduct.discountPrice || "",
        countInStock: selectedProduct.countInStock || "",
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        sizes: Array.isArray(selectedProduct.sizes) 
          ? selectedProduct.sizes.join(", ") 
          : "",
        colors: Array.isArray(selectedProduct.colors) 
          ? selectedProduct.colors.join(", ") 
          : "",
        collections: selectedProduct.collections || "",
        material: selectedProduct.material || "",
        gender: selectedProduct.gender || "",
        isFeatured: selectedProduct.isFeatured || false,
        isPublished: selectedProduct.isPublished !== undefined 
          ? selectedProduct.isPublished 
          : true,
      });
    }
  }, [selectedProduct, id, isCreateMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || 
        !formData.sku || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate price
    if (parseFloat(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const sizes = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);
      const colors = formData.colors.split(",").map(c => c.trim()).filter(Boolean);
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        countInStock: parseInt(formData.countInStock) || 0,
        sku: formData.sku.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        sizes: sizes.length > 0 ? sizes : ["One Size"],
        colors: colors.length > 0 ? colors : ["Default"],
        collections: formData.collections.trim() || "General",
        material: formData.material.trim(),
        gender: formData.gender,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
      };

      let result;
      
      if (isCreateMode) {
        // CREATE mode
        result = await dispatch(createProduct(productData)).unwrap();
        toast.success("Product created successfully!");
      } else {
        // EDIT mode
        result = await dispatch(updateProduct({ id, productData })).unwrap();
        toast.success("Product updated successfully!");
      }
      
      // Navigate back to products list after a short delay
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
      
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "An error occurred";
      toast.error(isCreateMode ? `Failed to create product: ${errorMessage}` : `Failed to update product: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state (only in EDIT mode)
  if (!isCreateMode && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  // Product not found (only in EDIT mode)
  if (!isCreateMode && !selectedProduct && !loading) {
    return (
      <div className="p-6 mx-auto max-w-7xl">
        <div className="p-6 text-center bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium mb-2">Product not found</p>
          <p className="text-sm text-gray-600 mb-4">The product you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isCreateMode ? "Create New Product" : "Edit Product"}
          </h2>
          <p className="text-sm text-gray-600">
            {isCreateMode 
              ? "Add a new product to your inventory" 
              : "Update product information"
            }
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center px-4 py-2 space-x-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            📋 Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter detailed product description"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., TUX-BLK-001"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Stock Keeping Unit (unique identifier)</p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Armani, Zara, H&M"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            💰 Pricing & Inventory
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Discount Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Optional sale price</p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Available units in stock</p>
            </div>
          </div>
        </div>

        {/* Categories & Classification */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            🏷️ Categories & Classification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Top Wear">Top Wear</option>
                <option value="Bottom Wear">Bottom Wear</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Collection
              </label>
              <select
                name="collections"
                value={formData.collections}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Collection</option>
                <option value="General">General</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Sport">Sport</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
                <option value="Featured">Featured</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Cotton, Wool, Polyester"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            🎨 Variants
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., XS, S, M, L, XL, XXL"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple sizes with commas</p>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Colors (comma-separated)
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Black, White, Blue, Red"
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple colors with commas</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            ⚙️ Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label className="font-medium text-gray-700 cursor-pointer">
                  Featured Product
                </label>
                <p className="text-sm text-gray-600">
                  Display this product prominently on the homepage
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label className="font-medium text-gray-700 cursor-pointer">
                  Published
                </label>
                <p className="text-sm text-gray-600">
                  Make this product visible to customers on the storefront
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Placeholder */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            📸 Product Images
          </h3>
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
            <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600 mb-1">Image upload feature</p>
            <p className="text-sm text-gray-500">Coming soon - You can add images after product creation</p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-6 py-3 text-white rounded-lg font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>{isCreateMode ? "Creating..." : "Updating..."}</span>
              </>
            ) : (
              <>
                {isCreateMode ? <FaPlus /> : <FaSave />}
                <span>{isCreateMode ? "Create Product" : "Update Product"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
