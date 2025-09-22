import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { FaBed, FaBath } from "react-icons/fa";
import { BiArea } from "react-icons/bi";

const PropertyList = () => {
  const { type } = useParams(); // house, apartment, etc.
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/properties/type/${type}`);
        setProperties(res.data.properties);
        console.log("Route param:", type);
        console.log("Fetched properties:", res.data.properties);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const handleViewDetails = (id) => {
    navigate(`/properties/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight capitalize text-gray-900">
            {type} Properties
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Discover handpicked {type} listings with photos, details, and pricing.
          </p>
        </div>

      {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-48 sm:h-52 lg:h-56 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
      ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg border border-red-200 text-center w-full sm:w-auto">
              {error}
            </div>
          </div>
      ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((p) => (
            <div
              key={p._id}
                className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Section */}
                <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
                <img
                  src={
                    p.images?.[0]
                      ? `http://localhost:5000/uploads/${p.images[0]}`
                        : "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={p.title}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                      console.error(
                        `Failed to load image for ${p.title}: http://localhost:5000/uploads/${p.images?.[0] || "null"}`
                      );
                      e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur text-gray-900 text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide border border-gray-100">
                      {p.type || type || "Listing"}
                </span>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-white text-gray-900 text-sm sm:text-base font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
                  ${p.price?.toLocaleString() || "N/A"}
                </span>
              </div>
              {/* Details Section */}
                <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-3 flex-1">
                  <h2 className="font-bold text-lg sm:text-xl text-gray-900 leading-snug line-clamp-1">
                    {p.title}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                  {p.location?.address || p.location?.city || "No location"}
                </p>
                  <div className="mt-1 grid grid-cols-3 gap-3 text-gray-700 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <FaBed className="text-blue-600 shrink-0" />
                      <span>{p.features?.bedrooms ?? 0} Beds</span>
                  </div>
                    <div className="flex items-center gap-1.5">
                      <FaBath className="text-blue-600 shrink-0" />
                      <span>{p.features?.bathrooms ?? 0} Baths</span>
                  </div>
                    <div className="flex items-center gap-1.5">
                      <BiArea className="text-blue-600 shrink-0" />
                      <span>{p.features?.area ?? 0} sqft</span>
                  </div>
                </div>
                  <div className="mt-auto pt-1">
                <button
                  onClick={() => handleViewDetails(p._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Details
                </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <span className="text-blue-600 text-2xl">🏠</span>
              </div>
              <p className="text-gray-900 font-semibold mb-1">No {type} properties found</p>
              <p className="text-gray-600 text-sm">Try adjusting your search or check back later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;