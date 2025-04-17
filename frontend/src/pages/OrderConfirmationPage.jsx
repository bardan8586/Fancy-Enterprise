const checkout = {
  _id: "1234",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "1",
      name: "Jacket",
      color: "Black",
      size: "M",
      price: 150,
      quantity: 1,
      image: "https://picsum.photos/150?random=1",
    },

    {
      productId: "2",
      name: "T-Shirt",
      color: "Red",
      size: "L",
      price: 200,
      quantity: 2,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  shippingAddress: {
    address: "123 Main St",
    city: "New York",
    country: "USA",
  },
};

const OrderConfirmationPage = () => {
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 7);
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center text-emerald-700">
        Thank You for Your Order!
      </h1>
      {checkout && (
        <div>
          <div className="flex justify-between mb-20">
            {/* Order Id and date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Estimated Delivery */}
            <div>
              <p className="text-sm text-emerald-700">
                Estimated Delivery:
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div>
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-16 h-16 mr-4 rounded-md"
                />

                <div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
