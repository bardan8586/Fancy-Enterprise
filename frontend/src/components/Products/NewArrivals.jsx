import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { getDisplayImage, getFallbackByCategory } from "../../utils/imageUtils";
import { NewArrivalsSkeleton } from "../Common/LoadingStates";
import OptimizedImage from "../Common/OptimizedImage";
const NewArrivals = () => {
  const scrollRef = useRef(null);
  // add scroll left which will be the initial position of the container
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //function that get called when left or right button is clicked
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behaviour: "smooth",
    });
  };

  const updateScrollButtons = () => {
    console.log("here");
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      setCanScrollLeft(leftScroll > 0);

      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;
      setCanScrollRight(rightScrollable);
    }

    console.log({
      scrollLeft: container.scrollLeft,
      clientWidth: container.clientWidth,
      containerScrollWidth: container.scrollWidth,
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
    }
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`)
      .then((res) => {
        if (!isMounted) return;
        setNewArrivals(res.data || []);
        setLoading(false);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError("Failed to load new arrivals");
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <div className="container relative mx-auto mb-10 text-center">
        <h2 className="mb-8 text-lg text-gray-600">Explore New Arrivals</h2>
        <p className="mb-8 text-lg text-gray-600">
          Discove the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <motion.button
            whileHover={{ scale: canScrollLeft ? 1.05 : 1 }}
            whileTap={{ scale: canScrollLeft ? 0.95 : 1 }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-3 border rounded-xl transition-all duration-200 ${
              canScrollLeft
                ? "bg-white text-black hover:bg-gray-50 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-xl" />
          </motion.button>

          <motion.button
            whileHover={{ scale: canScrollRight ? 1.05 : 1 }}
            whileTap={{ scale: canScrollRight ? 0.95 : 1 }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-3 border rounded-xl transition-all duration-200 ${
              canScrollRight
                ? "bg-white text-black hover:bg-gray-50 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-xl" />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Contents */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto text-center"
        >
          <div className="text-red-500 text-lg font-medium mb-2">Failed to load new arrivals</div>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      )}

      {loading && <NewArrivalsSkeleton />}

      {!loading && newArrivals.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          ref={scrollRef}
          className="container relative flex mx-auto space-x-6 overflow-x-scroll scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {newArrivals.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative group"
            >
              <Link to={`/product/${product._id}`} className="block">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-2xl shadow-lg"
                >
                  <OptimizedImage
                    src={getDisplayImage(product)}
                    alt={product.name}
                    className="w-full h-[500px] group-hover:scale-105 transition-transform duration-500"
                    fallbackCategory={product?.category}
                    fallbackGender={product?.gender}
                    aspectRatio=""
                  />

                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Product info overlay */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0.8 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  >
                    <div className="backdrop-blur-sm bg-black/20 rounded-xl p-4 -m-2">
                      <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold">${product.price}</p>
                        {product.rating && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Hover effect overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/10 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-lg"
                    >
                      View Details
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default NewArrivals;
