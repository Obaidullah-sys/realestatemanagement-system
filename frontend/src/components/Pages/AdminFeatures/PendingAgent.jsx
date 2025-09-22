// src/pages/PendingAgents.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { FaCheckCircle, FaTrash, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const PendingAgents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAgents(res.data.users.filter((u) => u.role === "agent" && !u.isApproved));
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const approveAgent = async (id) => {
    try {
      await axios.put(
        `/admin/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchPending();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to approve agent.");
    }
  };

  const deleteAgent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchPending();
    } catch (error) {
      console.error("Deletion failed:", error);
      alert("Failed to delete agent.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-indigo-700 mb-12 drop-shadow-md">
        Pending Agents
      </h1>

      {agents.length === 0 && (
        <p className="text-gray-500 text-center mt-16 text-lg">
          🎉 No pending agents found.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {agents.map((agent, index) => (
          <motion.div
            key={agent._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100"
          >
            {agent.image ? (
              <img
                src={`http://localhost:5000/uploads/${agent.image}`}
                alt={agent.name}
                className="w-28 h-28 rounded-full object-cover mb-5 border-4 border-indigo-100 shadow-sm"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-gray-400 mb-5" />
            )}

            <h2 className="text-xl font-semibold text-gray-800">{agent.name}</h2>
            <p className="text-gray-500 text-sm">{agent.email}</p>
            <p className="mt-2 text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full inline-block">
              Status: Pending
            </p>

            <div className="flex gap-3 mt-6 w-full justify-center">
              <button
                onClick={() => approveAgent(agent._id)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md"
              >
                <FaCheckCircle /> Approve
              </button>
              <button
                onClick={() => deleteAgent(agent._id)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PendingAgents;
