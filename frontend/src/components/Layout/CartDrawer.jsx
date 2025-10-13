import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoadingButton } from "../Common/LoadingStates";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const userId = user ? user._id : null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simulate loading for smooth UX
    setTimeout(() => {
      toggleCartDrawer();
      setIsCheckingOut(false);
      if (!user) {
        navigate("/login?redirect=checkout");
      } else {
        navigate("/checkout");
      }
    }, 800);
  };

  const cartItemsCount = cart?.products?.length || 0;
  const cartTotal = cart?.totalPrice || 0;

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleCartDrawer}
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCartDrawer}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <IoMdClose className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Cart contents with scrollable area */}
            <div className="flex-grow overflow-y-auto">
              {cartItemsCount > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6"
                >
                  <CartContents cart={cart} userId={userId} guestId={guestId} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center h-full p-6 text-center"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-4">Add some items to get started</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleCartDrawer}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Checkout section fixed at bottom */}
            {cartItemsCount > 0 && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                className="sticky bottom-0 p-6 bg-white border-t border-gray-100"
              >
                {/* Order Summary */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>

                {/* Checkout Button */}
                <LoadingButton
                  onClick={handleCheckout}
                  loading={isCheckingOut}
                  loadingText="Proceeding..."
                  className="w-full py-4 font-semibold text-white bg-black rounded-xl hover:bg-gray-800 transition-all duration-200"
                >
                  Proceed to Checkout
                </LoadingButton>

                {/* Security Badge */}
                <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure checkout powered by SSL encryption
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
