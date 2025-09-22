// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import FavoriteButton from "./FavoriteButton"; // <-- import your button

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/users/favourites");
        setFavorites(res.data.favourites || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to fetch favorite properties");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) return <div className="p-6 text-blue-600 animate-pulse">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Your Favorite Properties</h2>

      {favorites.length === 0 ? (
        <p>No favorite properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition relative"
            >
              {/* Image Section */}
              <div
                className="relative h-[240px] cursor-pointer"
                onClick={() => navigate(`/properties/${property._id}`)}
              >
                <img
                  src={
                    property.images?.[0]
                      ? `http://localhost:5000/uploads/${property.images[0]}`
                      : "https://via.placeholder.com/350x240"
                  }
                  alt={property.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error(
                      `Failed to load image for ${property.title}: http://localhost:5000/uploads/${
                        property.images?.[0] || "null"
                      }`
                    );
                    e.target.src = "https://via.placeholder.com/350x240";
                  }}
                />

                {/* Featured Tag */}
                <span className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
                  FEATURED
                </span>

                {/* Price Badge */}
                <span className="absolute bottom-4 left-4 bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-lg shadow-md">
                  ${property.price?.toLocaleString() || "N/A"}
                </span>

                {/* Favorite Button (top right corner) */}
                <div className="absolute top-4 right-4">
                  <FavoriteButton propertyId={property._id} />
                </div>
              </div>

              {/* Property Info */}
              {/* Property Info */}
<div
  className="p-4 cursor-pointer"
  onClick={() => navigate(`/properties/${property._id}`)}
>
  <h3 className="font-semibold text-lg">{property.title}</h3>
  <p className="text-gray-600">
    {property.location
      ? `${property.location.address}, ${property.location.city}, ${property.location.state} ${property.location.zipCode}`
      : "No location"}
  </p>
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
