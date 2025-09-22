import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { FaBed, FaBath } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

const PropertyCard = ({ property, onClick }) => {
  const imageUrl = property.images?.[0]
    ? `http://localhost:5000/uploads/${property.images[0]}`
    : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div
      className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col w-full max-w-[380px] mx-auto"
      onClick={onClick}
    >
      <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-white/90 backdrop-blur text-gray-900 text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide border border-gray-100">
            {property.propertyType || "Listing"}
          </span>
          <span className="bg-emerald-600 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide">
            Featured
          </span>
        </div>
        <span className="absolute bottom-3 left-3 bg-white text-gray-900 text-sm sm:text-base font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
          ${property.price?.toLocaleString() || "N/A"}
        </span>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 leading-snug line-clamp-1">
          {property.title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
          {property.location?.address || property.location?.city || "No location"}
        </p>

        <div className="grid grid-cols-3 gap-3 text-gray-700 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <FaBed className="text-blue-600 shrink-0" />
            <span>{property.beds ?? 0} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaBath className="text-blue-600 shrink-0" />
            <span>{property.baths ?? 0} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BiArea className="text-blue-600 shrink-0" />
            <span>{property.area ?? 0} sqft</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-medium text-gray-500 capitalize mt-auto">
          {property.status || "For Sale"}
        </p>
      </div>
    </div>
  );
};

const PropertySlider = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const res = await axios.get("/properties/featured?limit=20");
        if (res.data?.success) {
          const now = new Date();
          const strict = (res.data.properties || []).filter((p) => {
            const agent = p.agent;
            const expiry = agent?.subscriptionExpiry ? new Date(agent.subscriptionExpiry) : null;
            return p.isFeatured === true && agent?.hasSubscription && expiry && expiry > now;
          });
          setProperties(strict);
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      }
    };
    fetchFeaturedProperties();
  }, []);

  const handleCardClick = (id) => navigate(`/properties/${id}`);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
            Featured Properties
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Handpicked listings with photos, details, and pricing.
          </p>
        </div>
        <button
          onClick={() => navigate("/properties")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 w-full sm:w-auto"
        >
          See All Properties
        </button>
      </div>

      {properties.length > 0 ? (
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true, dynamicBullets: true }}
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-12 sm:pb-16"
        >
          {properties.map((property) => (
            <SwiperSlide key={property._id} className="flex items-stretch justify-center">
              <PropertyCard property={property} onClick={() => handleCardClick(property._id)} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500">No featured properties right now.</p>
      )}

      <style jsx>{`
        .swiper-pagination-bullet {
          background-color: #3b82f6;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background-color: #3b82f6;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default PropertySlider;
export { PropertyCard };