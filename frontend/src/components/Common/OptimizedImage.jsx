import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getFallbackByCategory, buildSrcSet } from "../../utils/imageUtils";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  fallbackCategory = "",
  fallbackGender = "",
  aspectRatio = "aspect-square",
  showLoader = true,
  ...props
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    src: src
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority
  });

  // Create low quality placeholder for progressive loading
  const createLowQualityPlaceholder = (originalSrc) => {
    if (!originalSrc?.includes('unsplash.com')) return null;
    return originalSrc.replace(/w=\d+/, 'w=50').replace(/q=\d+/, 'q=20') + '&blur=20';
  };

  const lowQualitySrc = createLowQualityPlaceholder(src);
  const shouldLoad = priority || inView;

  useEffect(() => {
    if (!shouldLoad) return;

    const img = new Image();
    img.onload = () => {
      setImageState(prev => ({ ...prev, loaded: true }));
    };
    img.onerror = () => {
      const fallbackSrc = getFallbackByCategory(fallbackCategory, fallbackGender);
      setImageState({
        loaded: true,
        error: true,
        src: fallbackSrc
      });
    };
    img.src = imageState.src;
  }, [shouldLoad, imageState.src, fallbackCategory, fallbackGender]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/* Low quality placeholder for progressive loading */}
      {shouldLoad && lowQualitySrc && !imageState.loaded && (
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={lowQualitySrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          loading="eager"
        />
      )}

      {/* Loading skeleton */}
      {showLoader && !imageState.loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Main image */}
      <AnimatePresence>
        {shouldLoad && (
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: imageState.loaded ? 1 : 0,
              scale: imageState.loaded ? 1 : 1.05
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            src={imageState.src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            srcSet={buildSrcSet(imageState.src)}
            sizes={sizes}
            {...props}
          />
        )}
      </AnimatePresence>

      {/* Shimmer effect overlay */}
      {!imageState.loaded && shouldLoad && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer transform -translate-x-full"></div>
      )}
    </div>
  );
};

export default OptimizedImage;

