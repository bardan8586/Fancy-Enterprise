import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error, validationErrors } = useSelector(
    (state) => state.auth
  );
  const { cart } = useSelector((state) => state.cart);

  // Get redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const fieldError = useMemo(() => {
    if (!validationErrors) return {};
    return validationErrors.reduce((acc, curr) => {
      acc[curr.param] = curr.msg;
      return acc;
    }, {});
  }, [validationErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-center w-full p-8 md:w-1/2 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-center">Hey there! 👋🏻</h2>
          <p className="mb-6 text-center">
            Enter your username and password to Login.
          </p>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 border rounded ${
                fieldError.name ? "border-red-400" : ""
              }`}
              placeholder="Enter your Name"
              aria-invalid={Boolean(fieldError.name)}
            />
            {fieldError.name && (
              <p className="mt-1 text-sm text-red-500">{fieldError.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded ${
                fieldError.email ? "border-red-400" : ""
              }`}
              placeholder="Enter your email address"
              aria-invalid={Boolean(fieldError.email)}
            />
            {fieldError.email && (
              <p className="mt-1 text-sm text-red-500">{fieldError.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded ${
                fieldError.password ? "border-red-400" : ""
              }`}
              placeholder="Enter your password"
              aria-invalid={Boolean(fieldError.password)}
            />
            {fieldError.password && (
              <p className="mt-1 text-sm text-red-500">{fieldError.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-2 font-semibold text-white transition bg-black rounded-lg hover:bg-gray-800"
          >
            {loading ? "loading..." : "Sign Up"}
          </button>
          <p className="mt-6 text-sm text-center">
            Don't have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden w-1/2 bg-gray-800 md:block">
        <div className="flex flex-col items-center justify-center h-full">
          <img
            src={register}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default Register;
