import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { FiMessageSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 👈 add this

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 for navigation

  const fetchReviews = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("/reviews/my-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // filter out reviews where propertyType is "Unknown"
      const filteredReviews = (res.data.reviews || []).filter(
        (review) => review.propertyType !== "Unknown"
      );
      setReviews(filteredReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewClick = (propertyId) => {
    if (propertyId) {
      navigate(`/properties/${propertyId}`); // 👈 go to property details
    } else {
      alert("This review is not linked to a property.");
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <FiMessageSquare className="text-indigo-600" size={26} /> Reviews from
        Users
      </motion.h2>

      {loading ? (
        <p className="text-blue-600 animate-pulse">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews found on your properties.</p>
      ) : (
        <motion.div
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              onClick={() => handleReviewClick(review.propertyId)} // 👈 clickable
              className="bg-gradient-to-br from-white via-blue-50 to-white p-5 rounded-xl shadow-md border border-gray-200 transform transition duration-500 hover:scale-105 hover:shadow-lg cursor-pointer"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-lg font-semibold text-gray-800 mb-1">
                👤 <span className="text-indigo-600">{review.name}</span>
              </p>
              <p className="text-gray-700 mb-2">
                💬 <span className="font-medium">"{review.comment}"</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                🏠 Property:{" "}
                <span className="font-semibold text-blue-600">
                  {review.propertyType}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                ⏰ {new Date(review.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Review;
