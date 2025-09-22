import React, { useState } from "react";
import axios from "../utils/axios";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaRegComment } from "react-icons/fa";

const ScheduleTour = ({ propertyId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tourDate: "",
    tourTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post("/tours/schedule", {
        ...formData,
        propertyId,
      });
       console.log("Submitting tour:", { ...formData, propertyId });
      setSuccessMsg(res.data.message || "Tour scheduled successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        tourDate: "",
        tourTime: "",
        message: "",
      });
     
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error || "Failed to schedule tour. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-4 sm:p-6 w-full max-w-lg lg:max-w-sm border border-gray-100 mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-3 sm:p-4 text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Schedule a Tour</h2>
        <p className="text-xs sm:text-sm opacity-80">
          Book a time to visit this property in person
        </p>
      </div>

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-200 rounded-lg text-sm" role="status" aria-live="polite">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-sm" role="alert" aria-live="assertive">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <label className="block">
          <span className="sr-only">Full Name</span>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="name"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleChange}
              className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-700 text-sm sm:text-base"
          required
        />
          </div>
        </label>
        <label className="block">
          <span className="sr-only">Email Address</span>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          name="email"
          placeholder="Your Email Address"
          value={formData.email}
          onChange={handleChange}
              className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-700 text-sm sm:text-base"
          required
        />
          </div>
        </label>
        <label className="block">
          <span className="sr-only">Phone Number</span>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="phone"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={handleChange}
              className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-700 text-sm sm:text-base"
          required
        />
          </div>
        </label>

        {/* Date & Time (stack on mobile, side by side on md+) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="w-full sm:w-1/2">
            <span className="sr-only">Tour Date</span>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            name="tourDate"
            value={formData.tourDate}
            onChange={handleChange}
                className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-700 text-sm sm:text-base"
            required
          />
            </div>
          </label>
          <label className="w-full sm:w-1/2">
            <span className="sr-only">Tour Time</span>
            <div className="relative">
              <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="time"
            name="tourTime"
            value={formData.tourTime}
            onChange={handleChange}
                className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-700 text-sm sm:text-base"
            required
          />
            </div>
          </label>
        </div>

        {/* Message */}
        <label className="block">
          <span className="sr-only">Message</span>
          <div className="relative">
            <FaRegComment className="absolute left-3 top-3 text-gray-400" />
        <textarea
          name="message"
          placeholder="Additional message (optional)"
          value={formData.message}
          onChange={handleChange}
              className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-700 text-sm sm:text-base"
          rows="3"
        ></textarea>
          </div>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 disabled:opacity-60 text-sm sm:text-base flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          <span>{loading ? "Scheduling..." : "Book My Tour"}</span>
        </button>

        <p className="text-[11px] sm:text-xs text-gray-500 text-center">
          We respect your privacy. Your contact information will only be used for this request.
        </p>
      </form>
    </div>
  );
};

export default ScheduleTour;
