// src/pages/ComparePage.jsx
import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

// Import icons from their respective submodules
import { FaBed, FaBath, FaCar } from "react-icons/fa"; // Font Awesome
import { BiArea } from "react-icons/bi"; // Boxicons
import { MdOutlineCalendarToday } from "react-icons/md"; // Material Design
import { FiTrash2 } from "react-icons/fi"; // Feather

const ComparePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const compareList = JSON.parse(localStorage.getItem("compareList")) || [];
    if (compareList.length < 2) {
      setLoading(false);
      setError("Please select at least 2 properties to compare.");
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/properties/compare?ids=${compareList.join(",")}`);
        setProperties(res.data.properties || []);
      } catch (err) {
        console.error("Error fetching comparison:", err);
        setError("Failed to load properties for comparison. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const clearComparison = () => {
    localStorage.removeItem("compareList");
    setProperties([]);
    setError("Comparison cleared. Please select properties to compare.");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-white">
        <div className="animate-pulse text-xl font-semibold text-gray-600">
          Loading comparison...
        </div>
      </div>
    );
  }

  if (error || properties.length < 2) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-white">
        <p className="text-xl font-semibold text-red-600">{error || "Please select at least 2 properties to compare."}</p>
      </div>
    );
  }

  const detailsKeys = ["price", "propertyType", "status"];
  const featureKeys = [
    { key: "bedrooms", icon: FaBed, label: "Beds" },
    { key: "bathrooms", icon: FaBath, label: "Baths" },
    { key: "garages", icon: FaCar, label: "Garages" },
    { key: "area", icon: BiArea, label: "Area (sqft)" },
    { key: "yearBuilt", icon: MdOutlineCalendarToday, label: "Year Built" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Compare Properties
        </h1>
        <button
          onClick={clearComparison}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
        >
          <FiTrash2 /> Clear Comparison
        </button>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {properties.map((p, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            {p.images && p.images.length > 0 && (
              <img
                src={`http://localhost:5000/uploads/${p.images[0]}`}
                alt={p.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => (e.target.src = "https://via.placeholder.com/300x200")}
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{p.title}</h2>
            <p className="text-lg font-bold text-blue-600 mb-4">${p.price?.toLocaleString() || "N/A"}</p>

            {/* Features with Icons */}
            <div className="space-y-3 mb-4">
              {featureKeys.map(({ key, icon: Icon, label }) => (
                <div key={key} className="flex items-center gap-2 text-gray-700">
                  <Icon className="text-blue-500" />
                  <span>
                    <strong>{label}:</strong> {p.features?.[key] || "N/A"}
                  </span>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <strong className="text-gray-800">Amenities:</strong>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                {p.amenities &&
                  Object.entries(p.amenities)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                      <li key={key} className="capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </li>
                    ))}
              </ul>
            </div>

            {/* Location */}
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {p.location?.city || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b text-gray-700 font-semibold">Attribute</th>
                {properties.map((p, idx) => (
                  <th key={idx} className="p-3 border-b text-gray-700 font-semibold">
                    {p.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detailsKeys.map((key) => (
                <tr key={key} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
                  {properties.map((p, idx) => (
                    <td key={idx} className="p-3 text-gray-800">
                      {key === "price" ? `$${p[key]?.toLocaleString() || "N/A"}` : p[key] || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
              {featureKeys.map(({ key, label }) => (
                <tr key={key} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-600">{label}</td>
                  {properties.map((p, idx) => (
                    <td key={idx} className="p-3 text-gray-800">
                      {p.features?.[key] || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;