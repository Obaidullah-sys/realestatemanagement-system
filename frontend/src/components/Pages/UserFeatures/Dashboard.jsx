// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../../utils/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem("userEmail"); // Assume email is stored on login

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch favorite properties
        const favRes = await axios.get("/users/favourites");
        setFavorites(favRes.data.favourites || []);

        // Fetch user tours
        if (userEmail) {
          const tourRes = await axios.get("/api/user/tours", {
            params: { email: userEmail },
          });
          setTours(tourRes.data.tours || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userEmail]);

  if (loading) return <div className="p-6"><p className="text-blue-600 animate-pulse">Loading...</p></div>;
  if (error) return <div className="p-6"><p className="text-red-600">Error: {error}</p></div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorites Card */}
        <div
          onClick={() => navigate("/favorites")}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition"
        >
          <h3 className="text-xl font-semibold mb-4">Favorite Properties</h3>
          <p className="text-gray-600 mb-2">
            {favorites.length} {favorites.length === 1 ? "property" : "properties"}
          </p>
          
        </div>

        {/* Tours and Messages Card */}
<div
  onClick={() => navigate("/dashboard/messages")}
  className="cursor-pointer bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition"
>
  <h3 className="text-xl font-semibold mb-4">Tours and Messages</h3>
  
</div>
      </div>
    </div>
  );
};

export default Dashboard;