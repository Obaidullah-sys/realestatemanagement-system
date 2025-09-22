// src/pages/BuyRentOptions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BuyRentOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-4 py-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 text-center">
        See How Realtor Can Help
      </h2>
      <p className="text-gray-600 mb-8 text-xs sm:text-sm md:text-base text-center">
        Choose your option below
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl w-full">
        {/* Available Properties (for buying) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <img
            src="/images/tierra-mallorca-rgJ1J8SDEAY-unsplash.jpg"
            alt="Available Properties"
            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover rounded-xl mb-4"
          />
          <h3 className="text-base sm:text-lg md:text-xl font-semibold">
            Available Properties
          </h3>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm md:text-base">
            Explore properties available for purchase.
          </p>
          <button
            onClick={() => navigate("/properties/status/available")}
            className="mt-4 px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition text-xs sm:text-sm md:text-base"
          >
            Find a home →
          </button>
        </div>

        {/* Rented Properties (for renting) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <img
            src="/images/jose-alonso-6ZSzKPHfooU-unsplash.jpg"
            alt="Rented Properties"
            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover rounded-xl mb-4"
          />
          <h3 className="text-base sm:text-lg md:text-xl font-semibold">
            Rented Properties
          </h3>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm md:text-base">
            Find properties available for rent.
          </p>
          <button
            onClick={() => navigate("/properties/status/rented")}
            className="mt-4 px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition text-xs sm:text-sm md:text-base"
          >
            Find a rental →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyRentOptions;
