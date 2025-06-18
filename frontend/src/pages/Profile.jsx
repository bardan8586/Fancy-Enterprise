import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };
  console.log(user);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container p-4 mx-auto md:p-6">
        <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
          {/* left section */}
          <div className="w-full p-6 rounded-lg shadow-md md:w-1/3 lg:w-1/4">
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">
              {user?.name}
            </h1>
            <p className="mb-4 text-lg text-gray-600">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
