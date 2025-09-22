import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBed, FaBath } from "react-icons/fa";
import { BiArea } from "react-icons/bi";

const SearchResults = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching properties with query:", location.search);
        const response = await axios.get(
          `${BASE_URL}/api/properties/search${location.search}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        console.log("API response:", response.data);
        setProperties(response.data.properties);
      } catch (err) {
        console.error("Fetch error:", err, err.response?.headers);
        setError(err.response?.data?.error || 'Failed to fetch properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [location.search]);

  const handleViewDetails = (id) => {
    navigate(`/properties/${id}`);
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-gray-200 rounded mb-8 animate-pulse" />
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg border border-red-200 text-center shadow">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
            Search Results
        </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <span className="text-blue-600 text-2xl">🔎</span>
              </div>
              <p className="text-gray-900 font-semibold mb-1">No properties matched your search</p>
              <p className="text-gray-600 text-sm">Try adjusting your filters or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
                  <img
                    src={property.images?.[0] ? `${BASE_URL}/Uploads/${property.images[0]}` : 'https://via.placeholder.com/350x240'}
                    alt={property.title}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.error(`Failed to load image for ${property.title}: ${BASE_URL}/Uploads/${property.images?.[0] || 'null'}`);
                      e.target.src = 'https://via.placeholder.com/350x240';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur text-gray-900 text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide border border-gray-100">
                      {property.type || 'Listing'}
                  </span>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-white text-gray-900 text-sm sm:text-base font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
                    ${property.price?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug line-clamp-1">{property.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                    {property.location?.address || property.location?.city || "No location"}
                  </p>
                  <div className="mt-1 grid grid-cols-3 gap-3 text-gray-700 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <FaBed className="text-blue-600 shrink-0" />
                      <span>{property.features?.bedrooms ?? 0} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaBath className="text-blue-600 shrink-0" />
                      <span>{property.features?.bathrooms ?? 0} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BiArea className="text-blue-600 shrink-0" />
                      <span>{property.features?.area ?? 0} sqft</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-1">
                  <button
                    onClick={() => handleViewDetails(property._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;