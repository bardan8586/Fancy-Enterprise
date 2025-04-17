import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [ordertDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const mockOrderDetails = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "Paypal",
      shippingMethod: "Standard",
      shippingAddress: {
        city: "Sydney",
        country: "Australia",
      },
      orderItems: [
        {
          productId: "1",
          name: "T-Shirt",
          price: 100,
          quantity: 1,
          image: "https://picsum.photos/150?random=1",
        },

        {
          productId: "2",
          name: "Shirt",
          price: 150,
          quantity: 4,
          image: "https://picsum.photos/150?random=1",
        },
      ],
    };
    setOrderDetails(mockOrderDetails);
  }, [id]);

  return (
    <div className="p-4 mx-auto max-w-7xl sm:p-6">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">Order Details</h2>
      {!ordertDetails ? (
        <p>No Order Details Found</p>
      ) : (
        <div className="p-4 border rounded-lg sm:p-6">
          {/* Order Information */}
          <div className="flex flex-col justify-between mb-8 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold md:text-xl">
                Order Id: #{ordertDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(ordertDetails.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-start mt-4 sm:items-end sm:mt-0">
              <span
                className={`${
                  ordertDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {ordertDetails.isPaid ? "Approved" : "Pending"}
              </span>
              <span
                className={`${
                  ordertDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {ordertDetails.isDelivered ? "Approved" : "Pending"}
              </span>
            </div>
          </div>

          {/* Customer, payment, Shipping Info */}
          <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h4 className="mb-2 text-lg font-semibold">Payment Info</h4>
              <p>Payment Method:{ordertDetails.paymentMethod}</p>
              <p>Status: {ordertDetails.isPaid ? "Paid" : "Unpaid"} </p>
            </div>

            <div>
              <h4 className="mb-2 text-lg font-semibold">Shipping Info</h4>
              <p>Shipping Method:{ordertDetails.shippingMethod}</p>
              <p>
                Address:{" "}
                {`${ordertDetails.shippingAddress.city}, ${ordertDetails.shippingAddress.country}`}{" "}
              </p>
            </div>
          </div>

          {/* Product List */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Products</h4>
            <table className="min-w-full mb-4 text-gray-600">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {ordertDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="flex items-center px-4 py-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-12 h-12 mr-4 rounded-lg"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-8 py-4">${item.price}</td>
                    <td className="px-8 py-4">${item.quantity}</td>
                    <td className="px-8 py-4">${item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Back to Orders Link */}
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            Back to My Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
