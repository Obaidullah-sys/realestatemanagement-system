// src/Layouts/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../components/Auth/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check authentication state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      submenu: [
        { name: "Home 1", path: "/home-1" },
        { name: "Home 2", path: "/home-2" },
        { name: "Home 3", path: "/home-3" },
        { name: "Home 4", path: "/home-4" },
        { name: "Home 5", path: "/home-5" },
      ],
    },
    {
      name: "Listings",
      href: "/properties",
      submenu: [
        { name: "Properties 2 Columns", path: "/properties/2-columns" },
        { name: "Properties 3 Columns", path: "/properties/3-columns" },
      ],
    },
    {
      name: "Members",
      href: "#",
      submenu: [{ name: "Agents List", path: "/members/agents" }],
    },
    {
      name: "Blog",
      href: "#",
      submenu: [
        { name: "Grid Full", path: "/blog/grid-full" },
        { name: "List v1", path: "/blog/list-v1" },
        { name: "List v2", path: "/blog/list-v2" },
        { name: "Detail Post", path: "/blog/detail" },
      ],
    },
    {
      name: "Pages",
      href: "#",
      submenu: [
        { name: "Shop", path: "/shop" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Compare", path: "/compare" }, // ✅ compare screen
        { name: "Pricing", path: "/pricing" },
        { name: "FAQ", path: "/faq" },
        { name: "404", path: "/404" },
      ],
    },
  ];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Handle login success
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-600">Homez</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-6">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
                {item.submenu.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-10 border border-gray-100">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoggedIn && (
              <div className="relative group">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Phone */}
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-sm text-gray-600">+(088) 123 456 789</span>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 lg:px-4 py-2 rounded-md text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200 shadow-sm"
                  >
                    See Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Login / Register
                </button>
              )}
           {/*   <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                Submit Property
              </button>*/}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2 rounded-md border border-gray-200"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100 shadow-sm rounded-b-lg">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu.length > 0 && (
                    <div className="pl-4">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-3 py-1 text-sm text-gray-500 hover:text-blue-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoggedIn && (
                <div>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm text-gray-600">+(088) 123 456 789</span>
                </div>
                <div className="mt-3 space-y-1">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                    >
                      Login / Register
                    </button>
                  )}
                  {/*<button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                    Submit Property
                  </button>*/}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </header>
  );
};

export default Header;
