import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { FiSend } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { motion } from "framer-motion";

const Message = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchToursWithMessages();
  }, []);

  const fetchToursWithMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/messages/agent/tours", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTours(res.data.tours);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesForTour = async (tourId) => {
    try {
      const res = await axios.get(`/messages/agent/tour/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTour(res.data.tour);
      setMessages(res.data.messages);

      await axios.put(`/messages/agent/tour/${tourId}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;

    try {
      await axios.post(
        "/messages/agent/reply",
        { tourId: selectedTour.id, message: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply("");
      fetchMessagesForTour(selectedTour.id);
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 bg-gray-50 min-h-screen w-full max-w-6xl mx-auto">
      <motion.h2
        className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-6 text-gray-900 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BsChatDots className="text-blue-600" /> Messages
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Tour Inbox */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 h-[75vh] overflow-y-auto custom-scroll"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">Tours Inbox</h3>
          {loading ? (
            <p className="text-blue-500 animate-pulse text-sm sm:text-base">Loading...</p>
          ) : (
            tours.map((tour) => (
              <motion.div
                key={tour.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200 }}
                onClick={() => fetchMessagesForTour(tour.id)}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 border mb-2 overflow-hidden ${
                  selectedTour?.id === tour.id
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base break-words">{tour.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 break-words">{tour.email}</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                  💬 {tour.messageCount}
                  {tour.unreadCount > 0 && (
                    <span className="text-red-600 font-medium ml-1">
                      ({tour.unreadCount} unread)
                    </span>
                  )}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 h-[75vh] flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {selectedTour ? (
            <>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">
                Chat with <span className="text-blue-600">{selectedTour.name}</span>
              </h3>

              <div className="flex-1 overflow-y-auto custom-scroll space-y-2 sm:space-y-3 mb-3 sm:mb-4 px-1 sm:px-2">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`max-w-[80%] md:max-w-[70%] p-2 sm:p-3 rounded-xl shadow-sm text-xs sm:text-sm ${
                      msg.sender === "agent"
                        ? "bg-blue-500 text-white ml-auto text-right"
                        : "bg-gray-100 text-gray-900 mr-auto text-left"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'agent' ? 'text-white/80' : 'text-gray-500'}`}>{new Date(msg.createdAt).toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t pt-3 min-w-0">
                <motion.input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                  placeholder="Type your reply..."
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 100 }}
                />

                <motion.button
                  onClick={handleReply}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition text-white px-2 sm:px-4 py-2 rounded-lg flex items-center gap-2 shadow text-xs sm:text-sm"
                >
                  <FiSend /> <span className="hidden sm:inline">Send</span>
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              className="flex flex-col justify-center items-center h-full text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BsChatDots size={30} className="mb-2 sm:mb-3 text-blue-300" />
              <p className="text-sm sm:text-base">Select a tour to view messages</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scroll { scrollbar-width: thin; scrollbar-color: rgba(59,130,246,.6) transparent; }
        .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,.6); border-radius: 9999px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(37,99,235,.8); }
      `}</style>
    </div>
  );
};

export default Message;
