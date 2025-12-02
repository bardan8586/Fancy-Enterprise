import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWishlist } from "../redux/slices/wishlistSlice";
import ProductGrid from "../components/Products/ProductGrid";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(fetchWishlist());
  }, [dispatch, user, navigate]);

  return (
    <div className="min-h-screen py-10">
      <div className="container px-4 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Wishlist
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Save pieces you love and come back anytime.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading your wishlist...</p>
        )}

        {error && (
          <p className="text-center text-red-500 text-sm">{error}</p>
        )}

        {!loading && !error && (!items || items.length === 0) && (
          <p className="text-center text-gray-500">
            Your wishlist is empty. Tap the heart icon on any product to save it
            here.
          </p>
        )}

        {!loading && !error && items && items.length > 0 && (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
};

export default WishlistPage;


