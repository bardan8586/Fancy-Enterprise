import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getDisplayImage } from "../../utils/imageUtils";
import { ProductGridSkeleton } from "../Common/LoadingStates";
import OptimizedImage from "../Common/OptimizedImage";

const ProductCard = ({ product, index }) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/product/${product._id}`}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          {/* Product Image Container */}
          <div className="relative overflow-hidden">
            <OptimizedImage
              src={getDisplayImage(product)}
              alt={product.name}
              className="w-full h-80 group-hover:scale-105 transition-transform duration-500"
              fallbackCategory={product?.category}
              fallbackGender={product?.gender}
              aspectRatio="aspect-[4/5]"
            />
            
            {/* Discount Badge */}
            {hasDiscount && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              >
                -{discountPercentage}%
              </motion.div>
            )}

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <motion.h3 
              className="font-medium text-gray-900 mb-1 truncate group-hover:text-black transition-colors"
              layout
            >
              {product.name}
            </motion.h3>
            
            {product.brand && (
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
            )}
            
            <div className="flex items-center gap-2">
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

            {/* Rating Stars (if available) */}
            {product.rating && (
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  ({product.numReviews || 0})
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-red-500 text-lg font-medium mb-2">Oops! Something went wrong</div>
        <p className="text-gray-600">{error}</p>
      </motion.div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-gray-500 text-lg font-medium mb-2">No products found</div>
        <p className="text-gray-400">Try adjusting your filters or search terms</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <ProductCard 
          key={product._id || index} 
          product={product} 
          index={index} 
        />
      ))}
    </motion.div>
  );
};

export default ProductGrid;
