import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.jpg";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error, validationErrors } = useSelector(
    (state) => state.auth
  );
  const { cart } = useSelector((state) => state.cart);
  const [clientErrors, setClientErrors] = useState({});

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

  const serverFieldErrors = useMemo(() => {
    if (!validationErrors) return {};
    return validationErrors.reduce((acc, curr) => {
      acc[curr.param] = curr.msg;
      return acc;
    }, {});
  }, [validationErrors]);

  const fieldError = useMemo(() => {
    return { ...serverFieldErrors, ...clientErrors };
  }, [serverFieldErrors, clientErrors]);

  const clearClientError = (field) => {
    if (!clientErrors[field]) return;
    setClientErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return;
    }

    setClientErrors({});
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[520px] h-[520px] bg-[radial-gradient(circle,_rgba(255,154,98,0.3),transparent_60%)] blur-3xl -top-40 -left-32" />
        <div className="absolute w-[420px] h-[420px] bg-[radial-gradient(circle,_rgba(14,165,233,0.25),transparent_60%)] blur-3xl bottom-0 right-10" />
      </div>

      <div className="relative flex flex-col items-center justify-center w-full p-8 md:w-1/2 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-10 bg-white/90 backdrop-blur rounded-3xl shadow-[0_25px_70px_rgba(15,23,42,0.25)] border border-white/60"
        >
          <div className="flex justify-center mb-8">
            <p className="inline-flex px-4 py-1 text-xs tracking-[0.35em] uppercase rounded-full bg-slate-900/5 text-slate-500">
              Fancy Access
            </p>
          </div>
          <h2 className="mb-4 text-3xl font-semibold text-center text-slate-900">
            Hey there! 👋🏻
          </h2>
          <p className="mb-8 text-center text-slate-500">
            Sign in to unlock curated drops, wishlists, and seamless checkout.
          </p>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-slate-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearClientError("email");
              }}
              className={`w-full p-3 text-sm border rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none ${
                fieldError.email ? "border-red-400" : "border-slate-200"
              }`}
              placeholder="Enter your email address"
              aria-invalid={Boolean(fieldError.email)}
            />
            {fieldError.email && (
              <p className="mt-1 text-sm text-red-500">{fieldError.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearClientError("password");
              }}
              className={`w-full p-3 text-sm border rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none ${
                fieldError.password ? "border-red-400" : "border-slate-200"
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
            className="w-full p-3 font-semibold text-slate-900 transition rounded-2xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 shadow-[0_18px_35px_rgba(255,122,24,0.35)] hover:shadow-[0_20px_45px_rgba(255,122,24,0.45)]"
          >
            {loading ? "loading..." : "Sign In"}
          </button>
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              Forgot your password?
            </Link>
          </div>
          <p className="mt-6 text-sm text-center text-slate-500">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-orange-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="relative hidden w-1/2 md:block">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/40" />
        <div className="flex flex-col items-center justify-center h-full p-8">
          <img
            src={login}
            alt="Login to Account"
            className="h-[780px] w-full object-cover rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] border border-white/10"
          />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full backdrop-blur bg-white/15 text-white text-sm tracking-[0.3em] uppercase border border-white/20">
            Members First
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
