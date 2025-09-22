import React, { useState } from "react";
import axios from "../../../utils/axios";
import { FiSend } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { motion } from "framer-motion";

const UserMessage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Fetch tours by name & email
  const fetchTours = async () => {
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(
        `/messages/user/tours?name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`
      );
      if (res.data.success) {
        setTours(res.data.tours);
      }
    } catch (err) {
      console.error("Fetch tours error:", err);
      setError(err.response?.data?.error || "Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Fetch messages for a specific tour
  const fetchMessages = async (tourId) => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(
        `/messages/user/tour/${tourId}?name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`
      );
      if (res.data.success) {
        setSelectedTour(res.data.tour);
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError(err.response?.data?.error || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Send new message to agent
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTour) return;
    try {
      const res = await axios.post("/messages/user/send", {
        tourId: selectedTour.id,
        message: newMessage,
      });
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "user",
            message: newMessage,
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send message");
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <motion.h2
        className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-6 text-gray-900 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BsChatDots className="text-blue-600 text-lg sm:text-xl" /> My Messages
      </motion.h2>

      {/* User inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 sm:p-3 rounded w-full text-sm sm:text-base"
        />
      </div>
      <button
        onClick={fetchTours}
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base hover:from-blue-700 hover:to-indigo-700 transition-colors w-full sm:w-auto shadow"
      >
        {loading ? "Loading..." : "Find My Tours"}
      </button>
      {error && <p className="text-red-500 mt-2 text-xs sm:text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 sm:mt-6">
        {/* Tour Inbox */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 h-[calc(70vh-120px)] sm:h-[70vh] overflow-y-auto custom-scroll"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-700">My Tours</h3>
          {loading ? (
            <p className="text-blue-500 animate-pulse text-sm sm:text-base">Loading...</p>
          ) : tours.length > 0 ? (
            tours.map((tour) => (
              <motion.div
                key={tour.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200 }}
                onClick={() => fetchMessages(tour.id)}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 border mb-1 sm:mb-2 ${
                  selectedTour?.id === tour.id
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {tour.property?.title || "Property"}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {new Date(tour.tourDate).toLocaleDateString()} at {tour.tourTime}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Agent: {tour.agent?.name}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">No tours found</p>
          )}
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 h-[calc(70vh-120px)] sm:h-[70vh] flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {selectedTour ? (
            <>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-700">
                Chat with{" "}
                <span className="text-blue-600">{selectedTour.agent?.name}</span>
              </h3>

              <div className="flex-1 overflow-y-auto custom-scroll space-y-2 mb-2 sm:mb-4 px-1 sm:px-2">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm sm:text-base">No messages yet</p>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      className={`max-w-[80%] md:max-w-[70%] p-2 sm:p-3 rounded-xl shadow-sm text-xs sm:text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white ml-auto text-right"
                          : "bg-gray-100 mr-auto text-left"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/80' : 'text-gray-500'}`}>{new Date(msg.createdAt).toLocaleString()}</p>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-2 border-t pt-2 sm:pt-3">
                <motion.input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 100 }}
                />

                <motion.button
                  onClick={sendMessage}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow"
                >
                  <FiSend /> Send
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

export default UserMessage;