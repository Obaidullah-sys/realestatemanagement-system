import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
    },
  }),
};

const ViewProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    price: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    yearBuilt: "",
    propertyType: "house",
    status: "available",
    description: "",
    amenities: {
      airConditioning: false,
      barbeque: false,
      dryer: false,
      gym: false,
      lawn: false,
      microwave: false,
      outdoorShower: false,
      refrigerator: false,
      swimmingPool: false,
      tvCable: false,
      washer: false,
      wifi: false,
      parking: false,
      furnished: false,
    },
    images: null,
    deleteImages: [], // Track images to delete
  });

  const fetchProperties = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/properties/my-properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data.properties);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      if (error.response?.status === 401 && error.response?.data?.message === "Token has expired") {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties();
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const handleEditClick = (property) => {
    setEditingId(property._id);
    setEditData({
      title: property.title,
      price: property.price,
      address: property.location?.address || "",
      city: property.location?.city || "",
      state: property.location?.state || "",
      zipCode: property.location?.zipCode || "",
      bedrooms: property.features?.bedrooms || 0,
      bathrooms: property.features?.bathrooms || 0,
      area: property.features?.area || 0,
      yearBuilt: property.features?.yearBuilt || "",
      propertyType: property.propertyType,
      status: property.status,
      description: property.description,
      amenities: property.amenities || {
        airConditioning: false,
        barbeque: false,
        dryer: false,
        gym: false,
        lawn: false,
        microwave: false,
        outdoorShower: false,
        refrigerator: false,
        swimmingPool: false,
        tvCable: false,
        washer: false,
        wifi: false,
        parking: false,
        furnished: false,
      },
      images: null,
      deleteImages: [], // Reset deleteImages when starting edit
    });
  };

  const handleRemoveImage = (image) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setEditData((prev) => ({
        ...prev,
        deleteImages: [...prev.deleteImages, image], // Add to delete list
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("price", editData.price);
    formData.append("propertyType", editData.propertyType);
    formData.append("status", editData.status);
    formData.append("description", editData.description);

    formData.append(
      "location",
      JSON.stringify({
        address: editData.address,
        city: editData.city,
        state: editData.state,
        zipCode: editData.zipCode,
      })
    );

    formData.append(
      "features",
      JSON.stringify({
        bedrooms: editData.bedrooms,
        bathrooms: editData.bathrooms,
        area: editData.area,
        yearBuilt: editData.yearBuilt,
      })
    );

    formData.append("amenities", JSON.stringify(editData.amenities));
    formData.append("deleteImages", JSON.stringify(editData.deleteImages)); // Send images to delete

    if (editData.images) {
      for (let i = 0; i < editData.images.length; i++) {
        formData.append("images", editData.images[i]);
      }
    }

    try {
      await axios.put(`/properties/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEditingId(null);
      fetchProperties();
    } catch (error) {
      console.error("Failed to update property:", error);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">🏠 My Properties</h2>

      {loading ? (
        <p className="text-blue-500 animate-pulse">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <motion.div className="grid gap-6" initial="hidden" animate="visible">
          {properties.map((prop, i) => (
            <motion.div
              key={prop._id}
              custom={i}
              variants={cardVariants}
              className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-md border transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden"
            >
              {editingId === prop._id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    placeholder="Price"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    placeholder="Address"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editData.city}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    placeholder="City"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editData.state}
                    onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                    placeholder="State"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={editData.zipCode}
                    onChange={(e) => setEditData({ ...editData, zipCode: e.target.value })}
                    placeholder="Zip Code"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    value={editData.bedrooms}
                    onChange={(e) => setEditData({ ...editData, bedrooms: e.target.value })}
                    placeholder="Bedrooms"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="number"
                    value={editData.bathrooms}
                    onChange={(e) => setEditData({ ...editData, bathrooms: e.target.value })}
                    placeholder="Bathrooms"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="number"
                    value={editData.area}
                    onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                    placeholder="Area (sqft)"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="number"
                    value={editData.yearBuilt}
                    onChange={(e) => setEditData({ ...editData, yearBuilt: e.target.value })}
                    placeholder="Year Built"
                    className="w-full border p-2 rounded"
                  />
                  <select
                    value={editData.propertyType}
                    onChange={(e) => setEditData({ ...editData, propertyType: e.target.value })}
                    className="w-full border p-2 rounded"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="office">Office</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="villa">Villa</option>
                  </select>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full border p-2 rounded"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="pending">Pending</option>
                  </select>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                    rows="3"
                  />
                  <label className="block font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {Object.entries(editData.amenities).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-2 text-gray-700 text-sm">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              amenities: { ...editData.amenities, [key]: e.target.checked },
                            })
                          }
                        />
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    ))}
                  </div>

                  <label className="block font-medium text-gray-700 mb-2">Existing Images</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {prop.images && prop.images.length > 0 ? (
                      prop.images.map((img, idx) => (
                        !editData.deleteImages.includes(img) && (
                          <div key={idx} className="relative">
                            <img
                              src={`http://localhost:5000/uploads/${img}`}
                              alt="property"
                              className="w-24 h-24 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/100x80";
                              }}
                            />
                            <button
                              onClick={() => handleRemoveImage(img)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                            >
                              <FaTrashAlt size={10} />
                            </button>
                          </div>
                        )
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No existing images</p>
                    )}
                  </div>

                  <label className="block font-medium text-gray-700 mb-2">Upload New Images</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setEditData({ ...editData, images: e.target.files })}
                    className="w-full mb-4"
                  />

                  <div className="flex gap-3 flex-wrap">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-400 text-white px-4 py-2 rounded w-full sm:w-auto"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                  <div className="flex gap-3 sm:gap-4 items-center min-w-0">
                    {prop.images && prop.images.length > 0 ? (
                      <motion.img
                        src={`http://localhost:5000/uploads/${prop.images[0]}`}
                        alt="property"
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-lg border flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg flex-shrink-0">
                        No Image
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate">{prop.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm break-words">
                        {prop.location?.address}, {prop.location?.city}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">Status: {prop.status}</p>
                      <p className="text-green-600 font-bold text-sm sm:text-base">
                        Price: ${prop.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    <button
                      onClick={() => handleEditClick(prop)}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto justify-center text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                    <motion.button
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 w-full sm:w-auto justify-center text-sm"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(prop._id)}
                    >
                      <FaTrashAlt /> Delete
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ViewProperties;