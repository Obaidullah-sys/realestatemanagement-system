// src/components/Favourites/FavoriteButton.jsx
import React, { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi"; // Outline heart
import { AiFillHeart } from "react-icons/ai"; // Filled heart
import axios from "../../utils/axios";

const FavoriteButton = ({ propertyId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await axios.get("/users/favourites");
        const favoriteIds = res.data.favourites.map((fav) => fav._id.toString());
        setIsFavorite(favoriteIds.includes(propertyId));
      } catch (error) {
        console.error(
          "Favorite check error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    checkFavorite();
  }, [propertyId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.post("/users/favourites/remove", { propertyId });
        setIsFavorite(false);
      } else {
        await axios.post("/users/favourites/add", { propertyId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(
        "Favorite toggle error:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) return <p className="text-gray-500">Checking...</p>;

  return (
    <button
      onClick={toggleFavorite}
      className="p-2 rounded-full transition-transform hover:scale-110"
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    >
      {isFavorite ? (
        <AiFillHeart className="text-red-500 w-6 h-6 transition-transform transform hover:scale-125" />
      ) : (
        <FiHeart className="text-gray-500 w-6 h-6 hover:text-red-500 transition-colors transform hover:scale-125" />
      )}
    </button>
  );
};

export default FavoriteButton;
