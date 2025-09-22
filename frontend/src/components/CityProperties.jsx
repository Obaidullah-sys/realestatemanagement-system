import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { PropertyCard } from "./PropertySlider";

const CityProperties = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // always send lowercase to backend for consistency
      const res = await axios.get(`/properties/city/${city.toLowerCase()}`);
      setProperties(res.data.properties);

      console.log(`Fetched properties for ${city}:`, res.data.properties);
    } catch (err) {
      console.error(`Error fetching properties for ${city}:`, err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const handleViewDetails = (id) => {
    navigate(`/properties/${id}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 capitalize">
            Properties in {city}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-12">
            Loading properties...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 py-12">{error}</p>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onClick={() => handleViewDetails(property._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">
            No properties found in {city}.
          </p>
        )}
      </div>
    </section>
  );
};

export default CityProperties;
