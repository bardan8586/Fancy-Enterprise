import { FaBars } from "react-icons/fa";
const AdminLayout = () => {
  return (
    <div className="relative flex flex-col min-h-screen md:flex-row">
      {/* Mobile Toggle Button */}
      <div className="flex p-4 text-white bg-gray-900 md:hidden">
        <button>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminLayout;
