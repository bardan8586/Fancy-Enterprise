import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, updateUser, deleteUser } from "../../redux/slices/adminSlice";
import { toast } from "sonner";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await dispatch(addUser(formData));
      
      if (result.type === "admin/addUser/fulfilled") {
        toast.success("User created successfully!");
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "customer",
        });
        
        // Refresh user list
        dispatch(fetchUsers());
      } else {
        toast.error(result.payload?.message || "Failed to create user");
      }
    } catch (error) {
      toast.error("Error creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const user = users.find(u => u._id === userId);
    
    if (!user) return;
    
    try {
      await dispatch(updateUser({
        id: userId,
        name: user.name,
        email: user.email,
        role: newRole
      }));
      
      toast.success("User role updated successfully!");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      await dispatch(deleteUser(userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h2 className="mb-6 text-2xl font-bold">User Management</h2>
      
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
          Error: {error}
        </div>
      )}
      
      {/* Add New User Form */}
      <div className="p-6 mb-6 bg-white border rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-bold">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 px-6 py-2 text-white rounded transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isSubmitting ? "Creating..." : "Add User"}
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold">All Users</h3>
          <p className="text-sm text-gray-600">
            {loading ? "Loading..." : `Total: ${users.length} users`}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg">No users found</p>
              <p className="text-sm">Add your first user above</p>
            </div>
          ) : (
            <table className="min-w-full text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`p-2 border rounded font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 border-purple-300' 
                            : 'bg-blue-100 text-blue-700 border-blue-300'
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-4 py-2 text-sm text-white transition-colors bg-red-500 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Stats Footer */}
      {!loading && users.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Admins</p>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="p-4 bg-white border rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Customers</p>
            <p className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'customer').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
