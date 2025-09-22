// src/pages/ApprovedAgents.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaUserTie } from 'react-icons/fa';

const ApprovedAgents = () => {
  const [agents, setAgents] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: '', email: '', role: '', isApproved: true });

  useEffect(() => {
    fetchApprovedAgents();
  }, []);

  const fetchApprovedAgents = async () => {
    try {
      const res = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const filteredAgents = res.data.users.filter(u => u.role === 'agent' && u.isApproved);
      setAgents(filteredAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const disapprove = async (id) => {
    try {
      await axios.put(`/admin/users/${id}`, { isApproved: false }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchApprovedAgents();
    } catch (error) {
      console.error('Disapprove failed:', error);
    }
  };

  const deleteAgent = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this agent?');
    if (!confirm) return;
    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchApprovedAgents();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete agent.');
    }
  };

  const openUpdateModal = (agent) => {
    setSelectedAgent(agent);
    setUpdatedData({
      name: agent.name,
      email: agent.email,
      role: agent.role,
      isApproved: agent.isApproved
    });
    setShowUpdateModal(true);
  };

  const handleModalChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/users/${selectedAgent._id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowUpdateModal(false);
      fetchApprovedAgents();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update agent. Check console for more info.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-sky-50 via-purple-50 to-pink-50">
      <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-8 text-center">
        ✨ Our Approved Agents
      </h1>

      {agents.length === 0 && (
        <p className="text-gray-600 text-center">No approved agents available.</p>
      )}

      {/* Agents Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {agents.map(agent => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <FaUserTie className="text-purple-600 text-xl" />
                <p className="text-lg font-semibold text-gray-800">{agent.name}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm mb-4">
                <FaEnvelope className="text-blue-500" />
                <p>{agent.email}</p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                <button
                  onClick={() => disapprove(agent._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg shadow"
                >
                  Disapprove
                </button>
                <button
                  onClick={() => openUpdateModal(agent)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteAgent(agent._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg shadow"
                >
                  Delete
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg"
            >
              <h2 className="text-xl font-bold text-purple-700 mb-4">Update Agent</h2>

              <input
                name="name"
                value={updatedData.name}
                onChange={handleModalChange}
                placeholder="Name"
                className="w-full mb-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
              />
              <input
                name="email"
                value={updatedData.email}
                onChange={handleModalChange}
                placeholder="Email"
                className="w-full mb-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
              />
              <select
                name="role"
                value={updatedData.role}
                onChange={handleModalChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
              >
                <option value="agent">Agent</option>
                <option value="user">User</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApprovedAgents;
