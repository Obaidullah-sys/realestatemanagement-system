import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { PropertyCard } from "../components/PropertySlider";
import { useNavigate } from "react-router-dom";

const AllProperties = ({ columns = 3 }) => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/properties/all");
        if (res.data.success) {
          // ✅ Only keep "available" or "rented"
          const filtered = res.data.properties.filter(
            (p) => p.status === "available" || p.status === "rented"
          );
          setProperties(filtered);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  // Build grid class dynamically
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className="py-10 px-6 bg-white">
      <h1 className="text-3xl font-bold mb-8">All Properties</h1>
      <div className={`grid ${gridClass} gap-6`}>
        {properties.map((property) => (
          <div
            key={property._id}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(`/properties/${property._id}`)}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProperties;
