// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaUserTie, FaCheckCircle, FaHourglassHalf, FaHome , FaStar} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, route: '/admin/users-detail', icon: <FaUsers />, color: 'from-blue-50 to-blue-100 text-blue-600' },
    { title: 'Total Agents', value: stats?.totalAgents || 0, route: '/admin/agents-detail', icon: <FaUserTie />, color: 'from-indigo-50 to-indigo-100 text-indigo-600' },
    { title: 'Approved Agents', value: stats?.approvedAgents || 0, route: '/admin/approved-agents', icon: <FaCheckCircle />, color: 'from-emerald-50 to-emerald-100 text-emerald-600' },
    { title: 'Pending Agents', value: stats?.pendingAgents || 0, route: '/admin/pending-agents', icon: <FaHourglassHalf />, color: 'from-amber-50 to-amber-100 text-amber-600' },
    { title: 'All Properties', value: stats?.totalProperties || 0, route: '/admin/all-properties', icon: <FaHome />, color: 'from-rose-50 to-rose-100 text-rose-600' },
    { title: 'Feature Approvals', value: stats?.approvedAgents || 0, route: '/admin/feature-approval', icon: <FaStar />, color: 'from-yellow-50 to-yellow-100 text-yellow-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-6 w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 sm:mb-10"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">👋 Hello Admin</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 mt-2">Here’s a quick overview of your platform.</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={() => navigate(card.route)}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-xl transition-transform transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{card.title}</h2>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${card.color}`}>
                <span className="text-lg sm:text-xl">{card.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
