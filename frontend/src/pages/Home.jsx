import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller Section */}
      <h2 className="mb-4 text-3xl font-bold text-center">Best Sellers</h2>
      <ProductDetails />
    </div>
  );
};

export default Home;
