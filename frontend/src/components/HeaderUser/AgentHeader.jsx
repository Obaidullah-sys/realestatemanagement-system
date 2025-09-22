// src/components/Header/AgentHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AgentHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-3 w-full max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 text-center sm:text-left">
          Agent Dashboard
        </h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition text-xs sm:px-4 sm:py-2 sm:text-sm md:text-base flex-shrink-0 min-w-[84px] sm:min-w-[96px] text-center"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AgentHeader;
