import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiOutlineHeart,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import FancyLogo from "../../assets/800w-V5Jc3vwV1Wk.webp";
import CartDrawer from "../Layout/CartDrawer";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  //get the cart item count from the cart
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container flex items-center justify-between px-6 py-4 mx-auto mt-4 bg-white/80 border border-white/40 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sticky top-4 z-40"
      >
        {/* left logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={FancyLogo}
              alt="Fancy logo"
              className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/70"
              loading="lazy"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent tracking-wide">
              FANCY
            </span>
          </Link>
        </motion.div>

        {/* center navigation link */}
        <div className="hidden space-x-8 md:flex">
          {[
            { to: "/collections/all?gender=Men", label: "Men" },
            { to: "/collections/all?gender=Women", label: "Women" },
            { to: "/collections/all?category=Top Wear", label: "Top Wear" },
            { to: "/collections/all?category=Bottom Wear", label: "Bottom Wear" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={item.to}
                className="relative text-sm font-semibold text-slate-600 uppercase tracking-wide hover:text-slate-900 transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* right icon */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/admin" className="px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200">
                Admin
              </Link>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/profile" className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200">
              <HiOutlineUser className="w-6 h-6 text-slate-700" />
            </Link>
          </motion.div>

          {/* Wishlist Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors duration-200">
              <HiOutlineHeart className="w-6 h-6 text-slate-700" />
              <AnimatePresence>
                {wishlistItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform rounded-full bg-red-500 min-w-[20px] h-5"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCartDrawer}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
          >
            <HiOutlineShoppingBag className="w-6 h-6 text-slate-700" />
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform rounded-full bg-ecomm-purple min-w-[20px] h-5"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Search Icon */}
          <div className="relative">
            <SearchBar />
          </div>

          {/* Hamburger menu icon which won't be visible on large screen */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleNavDrawer} 
            className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200 md:hidden"
          >
            <HiBars3BottomRight className="w-6 h-6 text-slate-700" />
          </motion.button>
        </div>
      </motion.nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* add a CartDrawer Component */}

      {/* Mobile navigation with backdrop */}
      <AnimatePresence>
        {navDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleNavDrawer}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={FancyLogo}
                    alt="Fancy logo"
                    className="w-12 h-12 rounded-full object-cover border border-white/70 shadow"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Fancy</p>
                    <h2 className="text-lg font-semibold text-gray-900">Curated Menu</h2>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleNavDrawer}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <IoMdClose className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-6">
                <nav className="space-y-2">
                  {[
                    { to: "/collections/all?gender=Men", label: "Men's Collection", icon: "👔" },
                    { to: "/collections/all?gender=Women", label: "Women's Collection", icon: "👗" },
                    { to: "/collections/all?category=Top Wear", label: "Top Wear", icon: "👕" },
                    { to: "/collections/all?category=Bottom Wear", label: "Bottom Wear", icon: "👖" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.to}
                        onClick={toggleNavDrawer}
                        className="flex items-center p-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 group"
                      >
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-200">
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                        <motion.span 
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                {user ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Welcome back!</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={toggleNavDrawer}
                      className="block w-full py-3 text-center bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={toggleNavDrawer}
                      className="block w-full py-3 text-center border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
