import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { getDisplayImage, buildSrcSet, defaultSizes, getFallbackByCategory } from "../../utils/imageUtils";
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
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 border rounded ${
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 border rounded ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable Contents */}
      {error && (
        <div className="container mx-auto text-center text-red-600">{error}</div>
      )}
      {loading && (
        <div className="container mx-auto text-center text-gray-500">Loading...</div>
      )}
      {!loading && newArrivals.length > 0 && (
        <div
        ref={scrollRef}
        className="container relative flex mx-auto space-x-6 overflow-x-scroll"
      >
          {newArrivals.map((product) => {
            const img = getDisplayImage(product);
            return (
              <div
                key={product._id}
                className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
              >
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-lg"
                  loading="lazy"
                  decoding="async"
                  srcSet={buildSrcSet(img)}
                  sizes={defaultSizes}
                  onError={(e) => {
                    e.currentTarget.src = getFallbackByCategory(product?.category, product?.gender);
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-opacity-50 rounded-b-lg backdrop-blur-md">
                  <Link to={`/product/${product._id}`} className="block">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="mt-1">${product.price}</p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
