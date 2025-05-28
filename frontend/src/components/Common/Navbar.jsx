import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container flex items-center justify-between px-6 py-4 mx-auto">
        {/* left logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            FANCY
          </Link>
        </div>

        {/* center navigation link */}
        <div className="hidden space-x-4 md:flex">
          <Link
            to="/collections/all"
            className="text-sm font-medium text-gray-700 uppercase hover:text-black "
          >
            Men
          </Link>

          <Link
            to="#"
            className="text-sm font-medium text-gray-700 uppercase hover:text-black "
          >
            Women
          </Link>

          <Link
            to="#"
            className="text-sm font-medium text-gray-700 uppercase hover:text-black "
          >
            Top Wear
          </Link>

          <Link
            to="#"
            className="text-sm font-medium text-gray-700 uppercase hover:text-black "
          >
            Bottom Wear
          </Link>
        </div>

        {/* right icon */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link to="/admin" className="px-2 text-white bg-black rounded">
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="w-6 h-6 text-gray-700" />
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="w-6 h-6 text-gray-700" />
            <span className="absolute top-0 right-0 inline-flex justify-center px-2 py-1 text-xs font-bold text-red-100 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-ecomm-purple">
              0
            </span>
          </button>

          {/* Search Icon */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          {/* Hamburger menu icon which won't be visible on large screen */}
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* add a CartDrawer Component */}

      {/* Add mobile navigation drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose />
          </button>
        </div>
        {/* Navigation Links */}
        <div className="p-4">
          <h2 className="mb-4 text-xl font-semibold">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link to="#" className="block text-gray-600 hover:text-black">
              Women
            </Link>
            <Link to="#" className="block text-gray-600 hover:text-black">
              Top Wear
            </Link>
            <Link to="#" className="block text-gray-600 hover:text-black">
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
