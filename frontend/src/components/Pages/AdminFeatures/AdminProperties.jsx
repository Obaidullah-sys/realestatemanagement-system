// src/pages/AdminProperties.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { FaHome, FaTrash, FaMapMarkerAlt, FaUserTie, FaDollarSign, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/admin/properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/admin/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.filter((prop) => prop._id !== id));
    } catch (err) {
      alert('Failed to delete property');
      console.error('Delete error:', err);
    }
  };

  const handleFeature = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `/admin/properties/${id}/feature`,
        { isFeatured: !currentStatus }, // ✅ match backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state
      setProperties((prev) =>
        prev.map((prop) =>
          prop._id === id ? { ...prop, isFeatured: !currentStatus } : prop
        )
      );
    } catch (err) {
      alert('Failed to update featured status');
      console.error('Feature toggle error:', err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <FaHome className="text-blue-700 text-4xl" />
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Admin - Manage Properties
        </h1>
      </div>

      {/* Loading / Empty State */}
      {loading ? (
        <p className="text-blue-600 animate-pulse text-lg">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 text-lg">No properties found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((prop, index) => (
            <motion.div
              key={prop._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-52 overflow-hidden">
                {prop.images && prop.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${prop.images[0]}`}
                    alt="property"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Image Available
                  </div>
                )}

                {/* Featured Badge */}
                {prop.isFeatured && (
                  <span className="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h2 className="text-xl font-bold text-gray-800 truncate">{prop.title}</h2>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-blue-500" />
                  {prop.location?.address}, {prop.location?.city}
                </p>
                <p className="flex items-center gap-2 text-sm text-indigo-600">
                  <FaUserTie className="text-indigo-500" />
                  Agent: {prop.agent?.name || 'N/A'}
                </p>
                <p className="flex items-center gap-2 text-lg text-green-600 font-semibold">
                  <FaDollarSign className="text-green-500" /> ${prop.price}
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 border-t bg-gray-50 flex justify-between">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFeature(prop._id, prop.isFeatured)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors duration-300 ${
                    prop.isFeatured
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-white'
                  }`}
                >
                  <FaStar className="text-sm" />
                  {prop.isFeatured ? 'Unfeature' : 'Feature'}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(prop._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2 shadow-sm"
                >
                  <FaTrash className="text-sm" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
