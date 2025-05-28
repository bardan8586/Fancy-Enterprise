import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../assets/login.webp";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, guestId, loading, error } = useSelector((state) => state.auth);

  console.log(user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-center w-full p-8 md:w-1/2 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Fancy</h2>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-center">Hey there 👋 </h2>
          <p className="mb-6 text-center">
            Enter your username and password to login
          </p>

          {/* Error message */}
          {error && (
            <div className="p-2 mb-4 text-sm text-red-700 rounded">{error}</div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Sign In
          </button>

          <p className="mt-6 text-sm text-center">
            Don't have an account?
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden w-1/2 bg-gray-800 md:block">
        <div className="flex flex-col items-center justify-center h-full">
          <img
            src={login}
            alt="Login to Account"
            className="object-cover w-full h-[750px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
