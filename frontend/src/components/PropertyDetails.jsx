// src/pages/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Slider from "react-slick";
import {
  FaBed,
  FaBath,
  FaHome,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { MdOutlineCalendarToday } from "react-icons/md";
import ScheduleTour from "./ScheduleTour";
import Reviews from "./Reviews";
import FavoriteButton from "./Favourites/FavoriteButton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ✅ Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-black transition z-10"
  >
    <FaArrowRight className="text-sm sm:text-base" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-black transition z-10"
  >
    <FaArrowLeft className="text-sm sm:text-base" />
  </button>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/properties/public/${id}`);
        setProperty(res.data.property);
      } catch (err) {
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-[240px] sm:h-[360px] md:h-[420px] lg:h-[500px] bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="h-60 bg-gray-200 rounded-xl lg:col-span-2" />
            <div className="h-60 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg border border-red-200 text-center shadow">
          {error}
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <span className="text-blue-600 text-2xl">🏠</span>
          </div>
          <p className="text-gray-900 font-semibold mb-1">Property not found</p>
          <p className="text-gray-600 text-sm">It may have been removed or is temporarily unavailable.</p>
        </div>
      </div>
    );

  // Amenities & Features
  const amenitiesList = property.amenities
    ? Object.entries(property.amenities)
        .filter(([_, v]) => v)
        .map(([key]) =>
          key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
        )
    : [];

  const featuresList = property.features
    ? Object.entries(property.features)
        .filter(([_, v]) => v)
        .map(([key, v]) => {
          if (key === "area") return `${v} sqft`;
          if (key === "yearBuilt") return `Built in ${v}`;
          return `${v} ${key}`;
        })
    : [];

  // ✅ Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 sm:px-5 py-2 bg-gray-800 text-white text-sm sm:text-base rounded-lg shadow hover:bg-black transition"
      >
        ← Back
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
        {property.images?.length > 0 && (
          <div className="relative">
            <Slider {...sliderSettings} className="w-full h-[240px] sm:h-[360px] md:h-[420px] lg:h-[500px]">
              {property.images.map((img, idx) => (
                <div key={idx} className="w-full h-[240px] sm:h-[360px] md:h-[420px] lg:h-[500px] relative">
                  <img
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`Property ${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/1200x600")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                  {/* Top-left badge */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur text-gray-900 text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide border border-gray-100">
                      {property.type || "Listing"}
                    </span>
                  </div>

                  {/* Floating Buttons */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        if (!token) {
                          alert("Please login first to add favourites!");
                          return;
                        }
                      }}
                    >
                      <FavoriteButton propertyId={property._id} />
                    </button>

                    <button
                      onClick={() => {
                        const list =
                          JSON.parse(localStorage.getItem("compareList")) || [];
                        if (!list.includes(property._id)) {
                          list.push(property._id);
                          localStorage.setItem(
                            "compareList",
                            JSON.stringify(list)
                          );
                          alert("Added to compare!");
                        } else {
                          alert("Already in compare!");
                        }
                      }}
                      className="bg-white/80 backdrop-blur px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl shadow hover:bg-white transition"
                    >
                      Compare
                    </button>
                  </div>

                  {/* Price badge */}
                  <span className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white text-gray-900 text-sm sm:text-base font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
                    ${property.price?.toLocaleString()}
                  </span>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* Title + Price */}
        <div className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {property.title}
          </h1>
          <span className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-600 mt-2 md:mt-0">
            ${property.price?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-10">
        <InfoCard icon={<FaBed />} label="Beds" value={property.features?.bedrooms} />
        <InfoCard icon={<FaBath />} label="Baths" value={property.features?.bathrooms} />
        <InfoCard icon={<MdOutlineCalendarToday />} label="Year Built" value={property.features?.yearBuilt} />
       {/* <InfoCard icon={<FaHome />} label="Garages" value={property.features?.garages} />*/}
        <InfoCard icon={<BiArea />} label="Area" value={`${property.features?.area} sqft`} />
        <InfoCard icon={<FaHome />} label="Type" value={property.propertyType || "House"} />
      </div>

      {/* Overview + Tour */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {property.description}
          </p>
        </div>
        <ScheduleTour propertyId={property._id} />
      </div>

      {/* Features + Amenities */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Details</h2>
        {featuresList.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Features</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {featuresList.map((f, i) => (
                <span
                  key={i}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
        {amenitiesList.length > 0 && (
          <>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {amenitiesList.map((a, i) => (
                <span
                  key={i}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Location */}
      {property.location && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Location</h2>
          <p className="text-gray-700 text-sm sm:text-base">
            {property.location.address}, {property.location.city},{" "}
            {property.location.state}
          </p>
        </div>
      )}

      {/* Reviews */}
      <Reviews propertyId={property._id} />
    </div>
  );
};

// 📌 InfoCard Component
const InfoCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-3 sm:p-4 hover:shadow-lg transition">
    <div className="text-blue-600 text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">{icon}</div>
    <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    <p className="text-sm sm:text-base font-semibold text-gray-900">{value || "N/A"}</p>
  </div>
);

export default PropertyDetails;
