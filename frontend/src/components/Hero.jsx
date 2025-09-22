import React, { useState, useEffect } from "react";
import { FaSlidersH, FaSearch, FaHome } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion"; // Ensure Framer Motion is installed

const Hero = () => {
  const [searchType, setSearchType] = useState("All");
  const [propertyType, setPropertyType] = useState("Type");
  const [location, setLocation] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [yearBuilt, setYearBuilt] = useState(1950);
  const [area, setArea] = useState(0);
  const [bedrooms, setBedrooms] = useState("Any");
  const [bathrooms, setBathrooms] = useState("Any");
  const [amenities, setAmenities] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const categoryIcons = {
    house: { icon: "🏠", color: "bg-blue-800", label: "House" },
    apartment: { icon: "🏢", color: "bg-blue-700", label: "Apartment" },
    office: { icon: "🏢", color: "bg-blue-600", label: "Office" },
    villa: { icon: "🏰", color: "bg-blue-500", label: "Villa" },
    townhouse: { icon: "🏘️", color: "bg-blue-400", label: "Townhouse" },
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("/properties/type-counts");
        if (res.data.success) {
          const mapped = res.data.counts.map((item) => ({
            name: categoryIcons[item.propertyType]?.label || item.propertyType,
            count: item.count,
            icon: categoryIcons[item.propertyType]?.icon || "🏠",
            color: categoryIcons[item.propertyType]?.color || "bg-gray-500",
          }));
          setCategories(mapped);
        }
      } catch (error) {
        console.error("Error fetching property counts:", error);
        setCategories([
          { name: "House", count: 0, icon: "🏠", color: "bg-blue-800" },
          { name: "Apartment", count: 0, icon: "🏢", color: "bg-blue-700" },
          { name: "Office", count: 0, icon: "🏢", color: "bg-blue-600" },
          { name: "Villa", count: 0, icon: "🏰", color: "bg-blue-500" },
          { name: "Townhouse", count: 0, icon: "🏘️", color: "bg-blue-400" },
        ]);
      }
    };
    fetchCounts();
  }, []);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleAmenityChange = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSearch = () => {
    if (minPrice > maxPrice && maxPrice > 0) {
      alert("Minimum price cannot exceed maximum price");
      return;
    }
    const query = new URLSearchParams();
    if (searchType !== "All") query.append("status", searchType);
    if (propertyType !== "Type") query.append("type", propertyType);
    if (location) query.append("city", location);
    if (minPrice > 0) query.append("minPrice", minPrice);
    if (maxPrice > 0) query.append("maxPrice", maxPrice);
    if (yearBuilt > 1950) query.append("yearBuilt", yearBuilt);
    if (area > 0) query.append("area", area);
    if (bedrooms !== "Any") query.append("bedrooms", bedrooms.replace("+", ""));
    if (bathrooms !== "Any") query.append("bathrooms", bathrooms.replace("+", ""));
    if (amenities.length > 0) query.append("amenities", amenities.join(","));

    console.log("Search query:", query.toString());
    navigate(`/search?${query.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const slideIn = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/pexels-bertellifotografia-2980955.jpg')",
          filter: "brightness(0.7)",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div className="text-center mb-8 sm:mb-12" variants={fadeInUp}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg leading-tight">
            Discover Your Perfect Property
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-md mt-3 sm:mt-4">
            Explore a world of real estate opportunities tailored to your dreams.
          </p>
        </motion.div>

       {/* <motion.div className="flex justify-center mb-8" variants={fadeInUp}>
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-1 flex shadow-lg">
            {["All", "available", "sold", "pending", "rented"].map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  searchType === type
                    ? "bg-blue-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>*/}

        <motion.div
          className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 sm:p-6 max-w-5xl mx-auto border border-white/40"
          variants={slideIn}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            <div className="md:col-span-6">
              <div className="relative">
                <FaHome className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                <input
                  type="text"
                  placeholder="Enter city, neighborhood, or ZIP code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="Type">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="office">Office</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="villa">Villa</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-blue-600 hover:text-blue-800 transition-colors duration-200 rounded-lg border border-blue-100 bg-blue-50/50 hover:bg-blue-50"
                onClick={toggleAdvanced}
              >
                <FaSlidersH className="text-lg" />
                <span className="">Advanced</span>
              </button>
            </div>

            <div className="md:col-span-1 flex">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                aria-label="Search properties"
              >
                <FaSearch className="text-lg" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Advanced Filters</h2>
                  <button
                    onClick={toggleAdvanced}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <IoClose className="text-2xl" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="Type">Any Type</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="office">Office</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>

                  {/*<div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option value="">Any Location</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                  </div>*/}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Price: ${formatNumber(minPrice)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-left transition-all duration-200"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$0</span>
                      <span>$1,000,000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price: ${formatNumber(maxPrice)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-left transition-all duration-200"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$0</span>
                      <span>$1,000,000</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built: {yearBuilt}
                    </label>
                    <input
                      type="range"
                      min="1950"
                      max="2025"
                      step="1"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-left transition-all duration-200"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1950</span>
                      <span>2025</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area: {formatNumber(area)} sqft
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={area}
                      onChange={(e) => setArea(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-left transition-all duration-200"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0 sqft</span>
                      <span>5,000 sqft</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option>Any</option>
                      <option>1+</option>
                      <option>2+</option>
                      <option>3+</option>
                      <option>4+</option>
                      <option>5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Baths</label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <option>Any</option>
                      <option>1+</option>
                      <option>2+</option>
                      <option>3+</option>
                      <option>4+</option>
                      <option>5+</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      "parking",
                      "furnished",
                      "airConditioning",
                      "barbeque",
                      "dryer",
                      "gym",
                      "lawn",
                      "microwave",
                      "outdoorShower",
                      "refrigerator",
                      "swimmingPool",
                      "tvCable",
                      "washer",
                      "wifi",
                      "garage"
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                        />
                        <span className="text-sm text-gray-700">
                          {amenity
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={toggleAdvanced}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <motion.div
                key={category.name}
                onClick={() => navigate(`/properties/type/${category.name.toLowerCase()}`)}
                className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-blue-100 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-md"
                variants={fadeInUp}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 text-xl sm:text-2xl text-white`}
                >
                  {category.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-900">{formatNumber(category.count)}</h3>
                <p className="text-blue-700 text-sm sm:text-base">{category.name}</p>
                <p className="text-xs sm:text-sm text-blue-500">Properties</p>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-blue-100">Loading...</p>
          )}
        </motion.div>

        <style jsx>{`
          .slider-left {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
          }
          .slider-left::-webkit-slider-track {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
          }
          .slider-left::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            background: #1E3A8A;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            border: 2px solid white;
          }
          .slider-left::-webkit-slider-thumb:hover {
            background: #1E40AF;
          }
          .slider-left::-moz-range-track {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            border: none;
          }
          .slider-left::-moz-range-thumb {
            background: #1E3A8A;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .slider-left::-moz-range-thumb:hover {
            background: #1E40AF;
          }
          .overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
          .overflow-y-auto {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </motion.div>
    </section>
  );
};
export default Hero; 