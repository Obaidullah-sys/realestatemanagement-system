import React, { useState, useRef } from 'react';
import axios from '../../utils/axios';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineClose, AiOutlineCamera } from 'react-icons/ai';
import { createPortal } from 'react-dom';

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef();

  const handleChange = (e) => {
    if (e.target.name === 'profileImage') {
      const file = e.target.files[0];
      setFormData({ ...formData, profileImage: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      profileImage: null
    });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    try {
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          return;
        }
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => form.append(key, value));
        const res = await axios.post('/users/register', form);

        setMessage(formData.role === 'agent'
          ? 'Registered as Agent. Please wait for admin approval.'
          : res.data.message);
        resetForm();
      } 
      else if (mode === "login") {
        const res = await axios.post('/users/login', {
          email: formData.email,
          password: formData.password
        });
        const { token, user } = res.data;
        localStorage.setItem('token', token);

        if (user.role === 'admin') {
          window.location.href = '/admin-dashboard';
        } else if (user.role === 'agent') {
          if (!user.isApproved) {
            setMessage('Agent account not yet approved by admin.');
            return;
          }
          window.location.href = '/agent-dashboard';
        } else {
          window.location.href = '/';
        }
      } 
      else if (mode === "forgot") {
        const res = await axios.post('/users/forgot-password', { email: formData.email });
        setMessage(res.data.message || "Check your email for reset link.");
        resetForm();
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div role="dialog" aria-modal="true" className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 border border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            aria-label="Close authentication modal"
          >
            <AiOutlineClose size={22} />
          </button>

          <div className="flex flex-col items-center mb-6 mt-6">
            {mode === "register" && (
              <div className="relative mb-4">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden group border-2 border-blue-500 shadow-md"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle className="text-blue-600 text-6xl" />
                  )}
                  <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow group-hover:scale-110 transition-all">
                    <AiOutlineCamera className="text-gray-600" />
                  </div>
                </div>
                <input
                  type="file"
                  name="profileImage"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800">
              {mode === "register" ? "Create Account" : mode === "login" ? "Login" : "Forgot Password"}
            </h2>
            <p className="text-gray-500 text-sm">
              Welcome to <span className="text-blue-600 font-medium">Homez</span>
            </p>
          </div>

          <form className="flex flex-col space-y-4 text-sm">
            {mode === "register" && (
              <input
                name="name"
                type="text"
                value={formData.name}
                placeholder="Full Name"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            )}

            <input
              name="email"
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            {mode !== "forgot" && (
              <input
                name="password"
                type="password"
                value={formData.password}
                placeholder="Password"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            )}

            {mode === "register" && (
              <>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                </select>
                <p className="text-yellow-600 text-xs">Note: Agents require admin approval.</p>
              </>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-3 rounded-lg font-semibold shadow-md"
            >
              {mode === "register" ? "Register" : mode === "login" ? "Login" : "Send Reset Link"}
            </button>
          </form>

          {/* Footer options */}
          {mode === "login" && (
            <p
              onClick={() => { setMode("forgot"); setMessage(''); resetForm(); }}
              className="mt-3 text-sm text-blue-600 text-center cursor-pointer hover:underline"
            >
              Forgot Password?
            </p>
          )}

          <p
            onClick={() => {
              setMode(mode === "register" ? "login" : "register");
              setMessage('');
              resetForm();
            }}
            className="mt-5 text-sm text-blue-600 text-center cursor-pointer hover:underline"
          >
            {mode === "register" ? "Already have an account? Sign in" 
              : mode === "login" ? "Don’t have an account? Register"
              : "Back to Login"}
          </p>

          {message && (
            <p className="text-center text-red-500 mt-4 text-sm">{message}</p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AuthModal;
