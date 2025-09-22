// src/pages/UsersDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser, FaEnvelope, FaUserShield } from "react-icons/fa";

const UsersDetail = () => {
  const [users, setUsers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchUsers();
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setUpdatedData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowUpdateModal(true);
  };

  const handleModalChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/users/${selectedUser._id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowUpdateModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update user. Check console for more info.");
    }
  };

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 underline decoration-indigo-500 text-center">
        Website Users
      </h1>

      {/* Users Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <p className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaUser className="text-indigo-500" /> {user.name}
                </p>
                <p className="flex items-center gap-2 text-gray-600 mt-2 text-sm break-words">
                  <FaEnvelope className="text-indigo-400" /> {user.email}
                </p>
                <p className="flex items-center gap-2 text-gray-700 mt-2">
                  <FaUserShield className="text-indigo-400" />{" "}
                  <span className="capitalize font-semibold">{user.role}</span>
                </p>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => openUpdateModal(user)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
                >
                  Update
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => setShowUpdateModal(false)}
              >
                <FaTimes size={18} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
                Update User
              </h2>

              <div className="space-y-4">
                <input
                  name="name"
                  value={updatedData.name}
                  onChange={handleModalChange}
                  placeholder="Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  name="email"
                  value={updatedData.email}
                  onChange={handleModalChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <select
                  name="role"
                  value={updatedData.role}
                  onChange={handleModalChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersDetail;
