import { motion } from "framer-motion";

// Skeleton components for smooth loading states
export const ProductCardSkeleton = () => (
  <div className="p-4 bg-white rounded-lg animate-pulse">
    <div className="w-full mb-4 bg-gray-200 rounded-lg h-96"></div>
    <div className="h-4 mb-2 bg-gray-200 rounded"></div>
    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="max-w-6xl p-8 mx-auto bg-white rounded-lg animate-pulse">
    <div className="flex flex-col md:flex-row">
      {/* Left thumbnails skeleton */}
      <div className="flex-col hidden mr-6 space-y-4 md:flex">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>

      {/* Main image skeleton */}
      <div className="md:w-1/2">
        <div className="w-full bg-gray-200 rounded-lg h-96"></div>
      </div>

      {/* Right side content skeleton */}
      <div className="md:w-1/2 md:ml-10">
        <div className="h-8 mb-4 bg-gray-200 rounded"></div>
        <div className="h-6 mb-2 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 mb-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-16 mb-4 bg-gray-200 rounded"></div>
        <div className="h-32 mb-4 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export const NewArrivalsSkeleton = () => (
  <div className="container flex mx-auto space-x-6 overflow-x-scroll">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] animate-pulse">
        <div className="w-full bg-gray-200 rounded-lg h-[500px] mb-4"></div>
        <div className="h-4 mb-2 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

// Shimmer effect component
export const ShimmerWrapper = ({ children, isLoading = false }) => {
  if (!isLoading) return children;

  return (
    <div className="relative overflow-hidden bg-gray-200 rounded animate-pulse">
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
      {children}
    </div>
  );
};

// Smooth loading spinner
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} border-2 border-gray-300 border-t-gray-800 rounded-full ${className}`}
    />
  );
};

// Enhanced loading button
export const LoadingButton = ({ 
  loading = false, 
  children, 
  className = "", 
  loadingText = "Loading...",
  ...props 
}) => (
  <motion.button
    whileHover={{ scale: loading ? 1 : 1.02 }}
    whileTap={{ scale: loading ? 1 : 0.98 }}
    disabled={loading}
    className={`${className} transition-all duration-200 flex items-center justify-center gap-2 ${
      loading ? 'opacity-80 cursor-not-allowed' : ''
    }`}
    {...props}
  >
    {loading && <LoadingSpinner size="sm" />}
    {loading ? loadingText : children}
  </motion.button>
);

