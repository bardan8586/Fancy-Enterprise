import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { fetchUsers } from "../redux/slices/adminSlice";
import { 
  FaDollarSign, 
  FaShoppingCart, 
  FaBox, 
  FaUsers, 
  FaArrowUp, 
  FaArrowDown,
  FaChartLine,
  FaChartBar,
  FaChartPie
} from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalUsers = users.length;
    const totalProducts = products.length;
    
    // Sales over time (last 7 days)
    const last7Days = [];
    const salesData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(dateStr);
      
      const daySales = orders
        .filter(order => order.createdAt && order.createdAt.split('T')[0] === dateStr)
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      salesData.push(daySales);
    }

    // Orders by status
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'Processing';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Revenue by category
    const categoryRevenue = products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      const productRevenue = orders.reduce((sum, order) => {
        const orderItem = order.orderItems?.find(item => 
          item.productId?._id === product._id || item.productId === product._id
        );
        if (orderItem) {
          sum += (orderItem.quantity || 1) * (product.price || 0);
        }
        return sum;
      }, 0);
      
      acc[category] = (acc[category] || 0) + productRevenue;
      return acc;
    }, {});

    return {
      totalUsers,
      totalProducts,
      salesData,
      last7Days,
      statusCounts,
      categoryRevenue
    };
  }, [orders, products, users]);

  // Chart configurations
  const salesChartData = {
    labels: analytics.last7Days.map(date => 
      new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Sales ($)',
        data: analytics.salesData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const statusChartData = {
    labels: Object.keys(analytics.statusCounts),
    datasets: [
      {
        data: Object.values(analytics.statusCounts),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(analytics.categoryRevenue),
    datasets: [
      {
        data: Object.values(analytics.categoryRevenue),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (productsLoading || ordersLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (productsError || ordersError || usersError) {
    return (
      <div className="p-6 mx-auto max-w-7xl">
        <div className="p-4 text-red-600 bg-red-100 rounded-lg">
          <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
          {productsError && <p>Products: {productsError}</p>}
          {ordersError && <p>Orders: {ordersError}</p>}
          {usersError && <p>Users: {usersError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <FaArrowUp className="mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaDollarSign className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">
                View all orders
              </Link>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaShoppingCart className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
              <Link to="/admin/products" className="text-sm text-blue-600 hover:underline">
                Manage products
              </Link>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaBox className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
              <Link to="/admin/users" className="text-sm text-blue-600 hover:underline">
                Manage users
              </Link>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaUsers className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Over Time Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Over Time</h3>
            <FaChartLine className="text-blue-600" />
          </div>
          <div className="h-64">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Orders by Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orders by Status</h3>
            <FaChartPie className="text-green-600" />
          </div>
          <div className="h-64">
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Revenue by Category Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
          <FaChartBar className="text-purple-600" />
        </div>
        <div className="h-64">
          <Bar data={categoryChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user?.name || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminHomePage;
