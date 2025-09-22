import React, { useState } from "react";
import axios from "../../../utils/axios";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

const AddProperty = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "house",
    status: "available",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    yearBuilt: "",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [amenities, setAmenities] = useState({
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
    garage: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setImages((prev) => [...prev, ...Array.from(files)]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("propertyType", form.propertyType);
      data.append("status", form.status);

      data.append(
        "location",
        JSON.stringify({
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        })
      );

      data.append(
        "features",
        JSON.stringify({
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          area: form.area,
          yearBuilt: form.yearBuilt,
        })
      );

      data.append("amenities", JSON.stringify(amenities));
      images.forEach((file) => data.append("images", file));

      await axios.post("/properties", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Property added successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        propertyType: "house",
        status: "available",
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        yearBuilt: "",
      });
      setImages([]);

      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 w-full max-w-6xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🏡 Add New Property
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Title", name: "title", type: "text" },
          { label: "Price", name: "price", type: "number" },
          { label: "Address", name: "address", type: "text" },
          { label: "City", name: "city", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "Zip Code", name: "zipCode", type: "text" },
          { label: "Bedrooms", name: "bedrooms", type: "number" },
          { label: "Bathrooms", name: "bathrooms", type: "number" },
          { label: "Area (sqft)", name: "area", type: "number" },
          { label: "Year Built", name: "yearBuilt", type: "number" },
        ].map(({ label, name, type }) => (
          <motion.div key={name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </motion.div>
        ))}

        {/* Property Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Property Type</label>
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="office">Office</option>
            <option value="townhouse">Townhouse</option>
            <option value="villa">Villa</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={3}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Upload Images */}
        <div className="sm:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Upload Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Preview Uploaded Images */}
        {images.length > 0 && (
          <motion.div className="sm:col-span-2 flex flex-wrap gap-3">
            {images.map((file, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
              >
                <img src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border" />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  onClick={() => handleRemoveImage(idx)}
                >
                  <AiOutlineClose size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Amenities */}
        <motion.div className="sm:col-span-2">
          <label className="block font-medium text-gray-700 mb-2">Amenities</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              { label: "Air Conditioning", name: "airConditioning" },
              { label: "Barbeque", name: "barbeque" },
              { label: "Dryer", name: "dryer" },
              { label: "Gym", name: "gym" },
              { label: "Lawn", name: "lawn" },
              { label: "Microwave", name: "microwave" },
              { label: "Outdoor Shower", name: "outdoorShower" },
              { label: "Refrigerator", name: "refrigerator" },
              { label: "Swimming Pool", name: "swimmingPool" },
              { label: "TV Cable", name: "tvCable" },
              { label: "Washer", name: "washer" },
              { label: "WiFi", name: "wifi" },
              { label: "Parking", name: "parking" },
              { label: "Furnished", name: "furnished" },
              { label: "Garage", name: "garage" },
            ].map(({ label, name }) => (
              <label key={name} className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                <input type="checkbox" name={name} checked={amenities[name]} onChange={handleAmenityChange} />
                {label}
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        className={`mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? "Adding Property..." : "Add Property"}
      </motion.button>

      {/* Feedback Message */}
      {message && (
        <motion.p
          className={`mt-3 text-center font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message}
        </motion.p>
      )}
      </motion.form>
    </div>
  );
};

export default AddProperty;
