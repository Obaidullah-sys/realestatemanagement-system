// src/components/AgentCarousel.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const AgentCarousel = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/public/agents");
        const data = await res.json();
        setAgents(data);
      } catch (err) {
        console.error("Failed to fetch agents", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return <p className="p-4 text-gray-500">Loading agents...</p>;
  }

  if (agents.length === 0) {
    return <p className="p-4 text-gray-500">No agents found</p>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Agents
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the professional agents ready to help you find your dream property.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {agents.map((agent) => (
            <SwiperSlide key={agent._id}>
              <div className="relative text-center group cursor-pointer">
                {/* Agent Image */}
                <div className="w-full h-70 overflow-hidden rounded-lg relative">
                  <img
                    src={`http://localhost:5000/uploads/${agent.profileImage}`}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent 
                               flex items-center justify-center opacity-0 
                               group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
                  >
                    <p className="text-white text-lg font-semibold drop-shadow-lg">
                      {agent.propertyCount} Properties
                    </p>
                  </div>
                </div>
                {/* Agent Name */}
                <h3 className="mt-2 text-gray-800 font-medium">{agent.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AgentCarousel;
