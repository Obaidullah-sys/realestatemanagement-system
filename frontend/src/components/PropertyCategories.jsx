import React, { useEffect, useState } from 'react';
import axios from '../utils/axios'; // adjust path if needed

const PropertyCategories = () => {
  const [categories, setCategories] = useState([]);

  const categoryIcons = {
    house: { icon: '🏠', color: 'bg-blue-500', label: 'Houses' },
    apartment: { icon: '🏢', color: 'bg-green-500', label: 'Apartments' },
    office: { icon: '🏢', color: 'bg-purple-500', label: 'Office' },
    villa: { icon: '🏰', color: 'bg-orange-500', label: 'Villa' },
    townhouse: { icon: '🏘️', color: 'bg-red-500', label: 'Townhome' }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get('/properties/type-counts');
        if (res.data.success) {
          // Map backend data to card UI
          const mapped = res.data.counts.map(item => ({
            name: categoryIcons[item.propertyType]?.label || item.propertyType,
            count: item.count,
            icon: categoryIcons[item.propertyType]?.icon || '🏠',
            color: categoryIcons[item.propertyType]?.color || 'bg-gray-500'
          }));
          setCategories(mapped);
        }
      } catch (error) {
        console.error("Error fetching property counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Property Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore different types of properties available
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {category.count}
                </p>
                <p className="text-sm text-gray-500">
                  Properties
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Loading...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;
