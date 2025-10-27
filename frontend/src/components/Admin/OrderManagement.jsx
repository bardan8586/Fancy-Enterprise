import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../../redux/slices/adminOrderSlice";
import { toast } from "sonner";
import { 
  FaBox, FaEye, FaTrash, FaShippingFast, FaCheckCircle, 
  FaTimesCircle, FaClock, FaDollarSign, FaSearch, FaFilter 
} from "react-icons/fa";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color and icon
  const getStatusStyle = (status) => {
    const styles = {
      Processing: { color: "text-blue-700 bg-blue-100", icon: FaClock },
      Shipped: { color: "text-purple-700 bg-purple-100", icon: FaShippingFast },
      Delivered: { color: "text-green-700 bg-green-100", icon: FaCheckCircle },
      Cancelled: { color: "text-red-700 bg-red-100", icon: FaTimesCircle },
    };
    return styles[status] || styles.Processing;
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      toast.success("Order deleted successfully!");
      if (showDetailsModal && selectedOrder?._id === orderId) {
        setShowDetailsModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Statistics
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const processingOrders = orders.filter(o => o.status === "Processing").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
  const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <p className="text-sm text-gray-600">
          Manage and track customer orders
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-6">
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <FaBox className="text-3xl text-blue-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-bold text-green-600">${totalSales.toLocaleString()}</p>
              </div>
              <FaDollarSign className="text-3xl text-green-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
              </div>
              <FaClock className="text-3xl text-blue-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">{shippedOrders}</p>
              </div>
              <FaShippingFast className="text-3xl text-purple-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
          </div>
          
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{cancelledOrders}</p>
              </div>
              <FaTimesCircle className="text-3xl text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {!loading && orders.length > 0 && (
        <div className="p-4 mb-6 bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <FaSearch className="inline mr-2" />
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by Order ID, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <FaFilter className="inline mr-2" />
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {searchTerm || filterStatus !== "all" ? (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          ) : null}
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <FaBox className="mx-auto mb-4 text-5xl text-gray-300" />
              <p className="mb-2 text-lg font-medium">
                {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
              </p>
              <p className="text-sm text-gray-400">
                {orders.length === 0 ? (
                  <>Waiting for customer orders</>
                ) : (
                  <>Try adjusting your search or filters</>
                )}
              </p>
            </div>
          ) : (
        <table className="min-w-full text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
                {filteredOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  const StatusIcon = statusStyle.icon;
                  
                  return (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.user?.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{order.user?.email || "N/A"}</p>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <span className="text-sm">{order.orderItems?.length || 0} items</span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          order.isPaid 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-yellow-700 bg-yellow-100'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                  </td>
                      
                      <td className="px-4 py-4">
                    <select
                          value={order.status || "Processing"}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`text-xs font-medium rounded px-2 py-1 ${statusStyle.color} border-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                      
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 text-blue-600 transition-colors hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          
                    <button
                            onClick={() => handleDelete(order._id)}
                            className="p-2 text-red-600 transition-colors hover:bg-red-50 rounded"
                            title="Delete Order"
                    >
                            <FaTrash />
                    </button>
                        </div>
                  </td>
                </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {!loading && filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Displaying {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Order Details #{selectedOrder._id.slice(-8).toUpperCase()}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <p className="text-sm"><strong>Name:</strong> {selectedOrder.user?.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedOrder.user?.email}</p>
                </div>

                {/* Shipping Address */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-sm">{selectedOrder.shippingAddress?.address}</p>
                  <p className="text-sm">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                  <p className="text-sm">{selectedOrder.shippingAddress?.country}</p>
                </div>

                {/* Payment Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
                  <p className="text-sm"><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p className="text-sm">
                    <strong>Status:</strong>{" "}
                    <span className={selectedOrder.isPaid ? "text-green-600" : "text-yellow-600"}>
                      {selectedOrder.isPaid ? "Paid" : "Pending"}
                    </span>
                  </p>
                  {selectedOrder.isPaid && (
                    <p className="text-sm"><strong>Paid At:</strong> {new Date(selectedOrder.paidAt).toLocaleString()}</p>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
                  <p className="text-sm"><strong>Status:</strong> {selectedOrder.status}</p>
                  <p className="text-sm">
                    <strong>Delivered:</strong>{" "}
                    <span className={selectedOrder.isDelivered ? "text-green-600" : "text-gray-600"}>
                      {selectedOrder.isDelivered ? "Yes" : "No"}
                    </span>
                  </p>
                  {selectedOrder.isDelivered && (
                    <p className="text-sm"><strong>Delivered At:</strong> {new Date(selectedOrder.deliveredAt).toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems?.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect fill="%23f3f4f6" width="50" height="50"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <FaBox className="text-gray-400 text-lg" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                                {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                              </div>
                            </div>
                </td>
                          <td className="px-4 py-3 text-sm">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
                      ))}
          </tbody>
        </table>
      </div>
              </div>

              {/* Order Total */}
              <div className="flex justify-end">
                <div className="w-64 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedOrder._id)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
