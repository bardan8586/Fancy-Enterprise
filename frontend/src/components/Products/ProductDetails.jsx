import { act, useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";

const selectedProduct = {
  name: "Stylish Jacket",
  price: 120,
  originalPrice: 150,
  description: "This is a stylish jacket perfect for any ocassion",
  brand: "Fashion",
  material: "Leather",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Red", "Green"],
  images: [
    {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Stylish Jacket 1",
    },
    {
      url: "https://picsum.photos/500/500?random=2",
      altText: "Stylish Jacket 2",
    },
  ],
};

const similarProducts = [
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
];

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action == "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action == "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart", {
        duration: 2000,
      });
      return;
    }

    setIsButtonDisabled(true);

    setTimeout(() => {
      toast.success("Prodcut Added to Cart", {
        duration: 2000,
      });
      setIsButtonDisabled(false);
    }, 500);
  };

  return (
    <div className="py-6">
      <div className="max-w-6xl p-8 mx-auto bg-white rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* left thumbnails */}
          <div className="flex-col hidden mr-6 space-y-4 md:flex">
            {/* pass selectedProduct */}
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                // className="object-cover w-20 h-20 border"
                className={`object-cover w-20 h-20 border rounded-lg cursor-pointer ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <img
                src={mainImage}
                alt="Main Product"
                className="object-cover w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Mobile Thumbnails */}
          <div className="flex mb-4 space-x-4 md:hidden overscroll-x-auto">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className="object-cover w-20 h-20 border"
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right side */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="mb-2 text-2xl font-semibold md:text-3xl">
              {selectedProduct.name}
            </h1>
            <p className="mb-1 text-lg text-gray-600 line-through">
              {selectedProduct.originalPrice}
            </p>
            <p className="mb-2 text-xl text-gray-500">
              {selectedProduct.price}
            </p>
            <p className="mb-4 text-gray-600">{selectedProduct.description}</p>
            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors.map((color, index) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 border rounded-full ${
                      selectedColor === color
                        ? "border-4 border-black"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: color,
                      filter: "brightness(0.5)",
                    }}
                  ></button>
                ))}
              </div>
            </div>

            {/* container for sizes */}
            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size ? "bg-black text-white" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Container for quantity */}
            <div className="mb-6">
              <p className="text-gray-700">Quantity</p>
              <div className="flex items-center mt-2 space-x-4">
                <button
                  className="px-2 py-1 text-lg bg-gray-200 rounded"
                  onClick={() => handleQuantityChange("minus")}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="px-2 py-1 text-lg bg-gray-200 rounded"
                  onClick={() => handleQuantityChange("plus")}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`w-full px-6 py-2 mb-4 text-white bg-black rounded ${
                isButtonDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "Add to Cart"}
            </button>

            {/* Charactersistics section */}
            <div className="mt-10 text-gray-700">
              <h3 className="mb-4 text-xl font-bold">Characteristics</h3>
              <table className="w-full text-sm text-left text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-20">
          <h2 className="mb-4 text-2xl font-medium text-center">
            You may also like
          </h2>
          {/* Make a separate component for product grid and pass it here */}
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
