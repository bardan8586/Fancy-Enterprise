import { Link } from "react-router-dom";
import { getDisplayImage, getFallbackByCategory, buildSrcSet, defaultSizes } from "../../utils/imageUtils";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-col-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`}>
          <div className="p-4 bg-white rounded-lg">
            <div className="w-full mb-4 h-96">
              <img
                src={getDisplayImage(product)}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg"
                loading="lazy"
                decoding="async"
                srcSet={buildSrcSet(getDisplayImage(product))}
                sizes={defaultSizes}
                onError={(e) => {
                  e.currentTarget.src = getFallbackByCategory(product?.category, product?.gender);
                }}
              />
            </div>
            <h3 className="mb-2 text-sm">{product.name}</h3>
            <p className="text-sm font-medium tracking-tighter text-gray-500">
              {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
