import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState(""); // State to store selected file name

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFormData({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          password: "",
        });
        setPreview(`http://localhost:5000/uploads/${data.user.profileImage}`);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setFileName(file ? file.name : ""); // Update file name state
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("role", formData.role);
    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        setFormData({
          ...formData,
          password: "",
        });
        setFileName(""); // Clear file name after successful update
      } else {
        setMessage(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred");
    }
  };

  if (loading) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 text-gray-500 text-center"
      >
        Loading...
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-4 text-blue-600 font-medium"
          >
            {message}
          </motion.p>
        )}
 Amplitude
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <AnimatePresence>
            {preview && (
              <motion.img
                key={preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={preview}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full mx-auto object-cover mb-4 border-2 border-blue-200"
              />
            )}
          </AnimatePresence>
          <div className="relative">
            <input
              type="file"
              id="profileImage"
              onChange={handleFileChange}
              className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer" // Hide default file input
            />
            <label
              htmlFor="profileImage"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Upload Profile Image
            </label>
            {fileName && (
              <p className="mt-2 text-sm text-gray-600">{fileName}</p>
            )}
          </div>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </motion.div>

        {/* Role */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Update Profile
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Profile;