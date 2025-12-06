import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../redux/slices/wishlistSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHeart, HiOutlineHeart, HiTrash } from "react-icons/hi2";
import { toast } from "sonner";
import OptimizedImage from "../components/Common/OptimizedImage";
import { getDisplayImage } from "../utils/imageUtils";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error || "Failed to remove from wishlist");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view your wishlist</h2>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <HiOutlineHeart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start adding items you love!</p>
          <Link
            to="/collections/all"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((product, index) => {
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;
            
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <OptimizedImage
                      src={getDisplayImage(product)}
                      alt={product.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackCategory={product?.category}
                      fallbackGender={product?.gender}
                      aspectRatio="aspect-[4/5]"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-medium text-gray-900 mb-1 truncate group-hover:text-black transition-colors">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      {hasDiscount ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            ${product.discountPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                      <span>Remove</span>
                    </motion.button>
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 text-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
