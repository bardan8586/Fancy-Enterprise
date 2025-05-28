import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef();

  const toggleSidbar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
        {
          _id: "1",
          name: "Product 1",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=3" }],
        },

        {
          _id: "2",
          name: "Product 2",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=4" }],
        },

        {
          _id: "3",
          name: "Product 3",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=5" }],
        },

        {
          _id: "4",
          name: "Product 4",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=6" }],
        },

        {
          _id: "5",
          name: "Product 5",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=7" }],
        },

        {
          _id: "6",
          name: "Product 6",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=8" }],
        },

        {
          _id: "7",
          name: "Product 7",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=9" }],
        },

        {
          _id: "8",
          name: "Product 8",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=10" }],
        },
      ];
      setProducts(fetchedProducts);
    }, 1000);
  }, []);

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    //clean even listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidbar}
        className="flex items-center justify-center p-2 border lg:hidden"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <FilterSidebar />
      </div>
    </div>
  );
};

export default CollectionPage;
