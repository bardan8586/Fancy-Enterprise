import { useState, useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Mock suggestions - in real app, these would come from API
  const mockSuggestions = [
    "Men's Shirts", "Women's Dresses", "Casual Wear", "Formal Suits", 
    "Summer Collection", "Winter Jackets", "Sports Wear", "Accessories"
  ];

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      navigate(`/collections/all?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      // Filter suggestions based on input
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    navigate(`/collections/all?search=${encodeURIComponent(suggestion)}`);
    setIsOpen(false);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={searchContainerRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={handleSearchToggle}
            />

            {/* Search Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 bg-white shadow-2xl z-50 md:absolute md:top-12 md:right-0 md:w-96 md:rounded-2xl md:border border-gray-200"
            >
              <form onSubmit={handleSearch} className="p-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-200 text-lg"
                  />
                  
                  {/* Search Icon */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-200"
                  >
                    <HiMagnifyingGlass className="w-5 h-5" />
                  </motion.button>

                  {/* Clear/Close Button */}
                  <motion.button
                    type="button"
                    onClick={handleSearchToggle}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-200"
                  >
                    <HiMiniXMark className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 space-y-1"
                    >
                      <p className="text-sm text-gray-500 mb-2 px-2">Suggestions</p>
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center group"
                        >
                          <HiMagnifyingGlass className="w-4 h-4 text-gray-400 mr-3 group-hover:text-gray-600" />
                          <span className="text-gray-700 group-hover:text-black">{suggestion}</span>
                          <motion.span 
                            className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            whileHover={{ x: 3 }}
                          >
                            →
                          </motion.span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3 px-2">Quick Search</p>
                  <div className="flex flex-wrap gap-2">
                    {["New Arrivals", "Sale", "Best Sellers"].map((term) => (
                      <motion.button
                        key={term}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200"
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Trigger Button */}
      {!isOpen && (
        <motion.button 
          onClick={handleSearchToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <HiMagnifyingGlass className="w-6 h-6 text-gray-700" />
        </motion.button>
      )}
    </div>
  );
};

export default SearchBar;
