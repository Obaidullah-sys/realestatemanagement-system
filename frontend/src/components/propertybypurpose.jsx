// src/pages/PropertiesByPurpose.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const PropertiesByPurpose = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/properties/status/${status}`);
        if (res.data.success) {
          setProperties(res.data.properties);
        } else {
          setError("Unexpected response from server");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.response?.data?.error || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [status]);

  const getHeading = () => {
    switch (status) {
      case "available":
        return "Available Properties";
      case "rented":
        return "Rented Properties";
      default:
        return "Properties";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-blue-600 animate-pulse text-lg">
          Loading properties...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-gray-800">
        {getHeading()}
      </h2>

      {properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 flex flex-col"
              onClick={() => navigate(`/properties/${property._id}`)}
            >
              <img
                src={`http://localhost:5000/uploads/${property.images?.[0]}`}
                alt={property.title}
                className="h-48 w-full object-cover"
                onError={(e) => (e.target.src = "/placeholder-image.jpg")}
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-1">
                  {property.location?.city}
                </p>
                <p className="text-pink-600 font-bold mt-2 text-base sm:text-lg">
                  ${property.price}
                </p>
                <button className="mt-auto bg-pink-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-pink-600 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesByPurpose;
