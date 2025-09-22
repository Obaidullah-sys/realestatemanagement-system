// src/components/ExploreCities.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ExploreCities = () => {
  const DEFAULT_CITY_IMAGE = "/images/geojango-maps-Z8UgB80_46w-unsplash.jpg";
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCityCounts = async () => {
      try {
        const res = await axios.get("/properties/city-counts");
        if (res.data.success) {
          const mappedCities = res.data.counts.map((item) => ({
            name: item.city,
            properties: item.count,
            image: DEFAULT_CITY_IMAGE,
          }));
          setCities(mappedCities);
        }
      } catch (error) {
        console.error("Error fetching city counts:", error);
      }
    };
    fetchCityCounts();
  }, []);

  const handleCityClick = (city) => {
    navigate(`/properties/city/${city.toLowerCase()}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-16 bg-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Cities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aliquam lacinia diam quis lacus euismod
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/properties")}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
            >
              All Cities →
            </button>
          </div>
        </motion.div>

        {/* City Cards */}
        {cities.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {cities.map((city, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => handleCityClick(city.name)}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  {/* City Image */}
                  <motion.img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.error(
                        `Failed to load image for ${city.name}: ${city.image}`
                      );
                      e.target.src = "https://via.placeholder.com/350x240";
                    }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>

                  {/* City Info */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                    <p className="text-lg mb-4">
                      {city.properties}{" "}
                      {city.properties === 1 ? "Property" : "Properties"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleCityClick(city.name);
                      }}
                      className="text-white hover:text-blue-200 font-medium transition-colors duration-300"
                    >
                      More Details →
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </motion.div>
    </section>
  );
};

export default ExploreCities;
