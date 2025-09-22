// src/pages/AgentsDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUserTie, FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AgentsDetail = () => {
  const [agents, setAgents] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    role: "",
    isApproved: false,
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const res = await axios.get("/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setAgents(res.data.users.filter((u) => u.role === "agent"));
  };

  const deleteAgent = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAgents();
    }
  };

  const openUpdateModal = (agent) => {
    setSelectedAgent(agent);
    setUpdatedData({
      name: agent.name,
      email: agent.email,
      role: agent.role,
      isApproved: agent.isApproved,
    });
    setShowUpdateModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    const val = name === "isApproved" ? value === "true" : value;
    setUpdatedData({ ...updatedData, [name]: val });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/users/${selectedAgent._id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowUpdateModal(false);
      fetchAgents();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update agent. Check console for more info.");
    }
  };

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-sky-50 to-blue-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 underline decoration-sky-500 text-center">
        All Agents
      </h1>

      {/* Agents Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {agents.map((agent, i) => (
            <motion.div
              key={agent._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div>
                <p className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                  <FaUserTie className="text-blue-500" /> {agent.name}
                </p>
                <p className="flex items-center gap-2 text-gray-600 mt-2 text-sm break-words">
                  <FaEnvelope className="text-blue-400" /> {agent.email}
                </p>
                <p className="flex items-center gap-2 mt-3 font-medium">
                  {agent.isApproved ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle /> Approved
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <FaTimesCircle /> Not Approved
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => deleteAgent(agent._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => openUpdateModal(agent)}
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
              <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
                Update Agent
              </h2>

              <div className="space-y-4">
                <input
                  name="name"
                  value={updatedData.name}
                  onChange={handleModalChange}
                  placeholder="Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  name="email"
                  value={updatedData.email}
                  onChange={handleModalChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  name="role"
                  value={updatedData.role}
                  onChange={handleModalChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="agent">Agent</option>
                  <option value="user">User</option>
                </select>
                <select
                  name="isApproved"
                  value={updatedData.isApproved}
                  onChange={handleModalChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value={true}>Approved</option>
                  <option value={false}>Not Approved</option>
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

export default AgentsDetail;
