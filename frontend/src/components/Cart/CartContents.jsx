import { RiDeleteBin3Line } from "react-icons/ri";

const CartContents = () => {
  const cartProducts = [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      quantity: 1,
      price: 100,
      image: "https://picsum.photos/200?random=1",
    },

    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Blue",
      quantity: 20,
      price: 25,
      image: "https://picsum.photos/200?random=2",
    },
    {
      productId: 3,
      name: "Shirt",
      size: "L",
      color: "Gray",
      quantity: 5,
      price: 15,
      image: "https://picsum.photos/200?random=3",
    },
  ];
  return (
    <div>
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-4 border-b"
        >
          <div className="flex items-center">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-20 h-24 mr-4 rounded"
            />

            <div className="ml-4">
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {product.size} | {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button className="px-2 py-1 text-xl font-medium border rounded">
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button className="px-2 py-1 text-xl font-medium border rounded">
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>${product.price}</p>
            <button>
              <RiDeleteBin3Line className="w-6 h-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
