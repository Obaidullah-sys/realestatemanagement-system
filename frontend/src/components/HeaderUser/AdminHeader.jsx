// src/components/Header/AdminHeader.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminHeader = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
      >
        Logout
      </button>
    </header>
  )
}

export default AdminHeader
