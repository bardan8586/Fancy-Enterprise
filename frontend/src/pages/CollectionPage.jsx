import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const [searchParams] = useSearchParams();
  const { collection } = useParams();

  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  const queryParams = Object.fromEntries([...searchParams]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef(null); //pass default as null

  const toggleSidbar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProductByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

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
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0 overflow-y-auto `} //add overflow-y-auto later after sidebar content
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
        <h2 className="mb-4 text-2xl uppercase">All Collection</h2>
        {/* Add sortOptions component */}
        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default CollectionPage;
