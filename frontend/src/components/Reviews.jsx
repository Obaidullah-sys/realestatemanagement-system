// src/components/Reviews.js
import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { MessageCircle } from "lucide-react";

const Reviews = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ name: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews for this property
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/reviews/property/${propertyId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) fetchReviews();
  }, [propertyId]);

  // Submit new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return;

    try {
      setSubmitting(true);
      await axios.post("/reviews/add", {
        propertyId,
        name: formData.name,
        comment: formData.comment,
      });
      setFormData({ name: "", comment: "" });
      fetchReviews(); // reload reviews after submit
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 space-y-10">
      {/* Reviews List Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" /> Client Reviews
        </h2>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="p-5 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  {/* Avatar circle with first letter */}
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-lg">
                    {review.reviewer?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.reviewer}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{review.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Form Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Leave a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <textarea
            placeholder="Write your review..."
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            rows="4"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
