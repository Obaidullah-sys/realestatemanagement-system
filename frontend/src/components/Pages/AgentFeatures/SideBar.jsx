import React, { useEffect, useState } from "react";
import {
  FiGrid,
  FiUser,
  FiMessageSquare,
  FiHeart,
  FiLogOut,
  FiPackage,
  FiMenu,
  FiX
} from "react-icons/fi";
import { BsHouseDoor } from "react-icons/bs";
import { motion } from "framer-motion";

export const Sidebar = ({ current, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiGrid /> },
    { id: "profile", label: "My Profile", icon: <FiUser /> },
    { id: "reviews", label: "Reviews", icon: <FiMessageSquare /> },
    { id: "messages", label: "Messages", icon: <FiMessageSquare /> },
    { id: "properties", label: "My Properties", icon: <BsHouseDoor /> },
    { id: "AddProperty", label: "Add Property", icon: <FiPackage /> },
    { id: "FeatureProperty", label: "Feature Property", icon: <FiPackage /> },
    { id: "logout", label: "Log Out", icon: <FiLogOut /> },
  ];

  return (
    <>
      {/* Mobile compact menu button (non-floating) */}
      <div className="md:hidden px-3 pt-3">
        <button
          aria-label="Open sidebar"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-black text-white w-10 h-10 shadow active:scale-[0.98]"
        >
          <FiMenu className="text-lg" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed md:static top-0 left-0 z-50 h-screen md:h-screen bg-white text-gray-800 shadow-xl p-6 w-64 lg:w-72 max-w-[80vw] overflow-y-auto
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Close button on mobile */}
        <div className="flex items-center justify-between md:block">
          <h2 className="text-xl md:text-2xl font-bold mb-8 tracking-wide text-gray-800">
            Agent Panel
          </h2>
          <button
            aria-label="Close sidebar"
            className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <button
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 md:px-4 md:py-3 rounded-lg transition-all duration-300
                  ${
                    current === item.id
                      ? "bg-black text-white shadow-md"
                      : "hover:bg-gray-100 hover:text-black"
                  }`}
              >
                <span className="text-lg md:text-xl mr-3">{item.icon}</span>
                <span className="text-sm md:text-base font-medium tracking-wide">{item.label}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </>
  );
};
