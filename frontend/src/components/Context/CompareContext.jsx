// src/context/CompareContext.jsx
import React, { createContext, useState, useContext } from "react";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (property) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p._id === property._id);
      if (exists) {
        return prev.filter((p) => p._id !== property._id);
      } else if (prev.length < 3) { // allow max 3
        return [...prev, property];
      } else {
        return prev;
      }
    });
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
