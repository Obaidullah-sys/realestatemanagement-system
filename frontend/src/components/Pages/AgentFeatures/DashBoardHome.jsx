import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { motion } from "framer-motion";

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [reviewsCount, setReviewsCount] = useState(0);

  const fetchDashboardData = async () => {
    setLoading(true);
    let token = localStorage.getItem("token");
   // console.log("Access Token:", token);
    try {
      const statsRes = await axios.get("/properties/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data.stats);

      const reviewsRes = await axios.get("/reviews/my-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviewsCount(reviewsRes.data.count || 0);
    } catch (error) {
      console.error("Dashboard load error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      if (error.response?.status === 401 && error.response?.data?.message === "Token has expired") {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await axios.post("/api/users/refresh", { refreshToken });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          token = res.data.token;
          const statsRes = await axios.get("/properties/stats", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStats(statsRes.data.stats);
          const reviewsRes = await axios.get("/reviews/my-reviews", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setReviewsCount(reviewsRes.data.count || 0);
        } else {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-blue-600 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        👋 Welcome Back, Agent
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties || 0}
          gradient="from-blue-500 to-indigo-500"
          delay={0.3}
        />
        <StatCard
          title="Sold Properties"
          value={stats.soldProperties || 0}
          gradient="from-green-400 to-emerald-500"
          delay={0.5}
        />
        <StatCard
          title="Reviews"
          value={reviewsCount}
          gradient="from-pink-500 to-rose-500"
          delay={0.7}
        />
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, gradient, delay = 0 }) => (
  <motion.div
    className={`bg-gradient-to-r ${gradient} text-white p-6 rounded-xl shadow-lg cursor-pointer`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.4, delay }}
  >
    <p className="text-sm uppercase tracking-wide opacity-80">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </motion.div>
);

export default DashboardHome;