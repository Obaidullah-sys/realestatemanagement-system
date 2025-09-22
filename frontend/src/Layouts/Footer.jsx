import React from 'react'

const Footer = () => {
  const quickLinks = [
    'Terms of Use',
    'Privacy Policy',
    'Pricing Plans',
    'Our Services',
    'Contact',
    'Careers',
    'FAQs'
  ]

  const discovery = [
    'Chicago',
    'Los Angeles',
    'New Jersey',
    'New York',
    'California'
  ]

  const popularSearch = [
    'Apartment for Sale',
    'Apartment for Rent',
    'Offices for Sale',
    'Offices for Rent'
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-400 mb-4 sm:mb-6">Homez</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+(088) 123 456 789</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>hi@homez.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Discovery */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Discovery</h4>
            <ul className="space-y-2 sm:space-y-3">
              {discovery.map((city, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Search */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Popular Search</h4>
            <ul className="space-y-2 sm:space-y-3">
              {popularSearch.map((search, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                    {search}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-xs sm:text-sm">
              © Homez – All rights reserved
            </div>
            <div className="flex gap-4 sm:gap-6 mt-2 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 