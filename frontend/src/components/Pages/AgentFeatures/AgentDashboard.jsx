{/*
import React, { useState, useEffect } from 'react';
import { FaBars, FaList, FaPlus } from 'react-icons/fa';
import ViewProperties from './ViewProperties';
import AddProperty from './AddProperties';

// Example: get agent name from localStorage or context
const getAgentName = () => {
  // Replace with your actual logic (context, Redux, etc.)
  return localStorage.getItem('agentName') || 'Agent';
};

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [agentName, setAgentName] = useState('Agent');

  useEffect(() => {
    setAgentName(getAgentName());
  }, []);

  return (
    <div className="flex min-h-screen">
      
      <div className={`bg-blue-700 text-white flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64 p-6' : 'w-16 p-2'} relative`}>
       
        <button
          className="absolute top-4 right-4 text-white focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars size={24} />
        </button>
        {sidebarOpen && (
          <>
            <h2 className="text-xl font-bold mb-2 mt-8">Hello, {agentName}</h2>
            <p className="mb-8 text-sm">How's your day going?</p>
          </>
        )}
        <nav className="flex flex-col gap-2 mt-8">
          <button
            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'view' ? 'bg-blue-900' : ''}`}
            onClick={() => setActiveTab('view')}
            title="View Properties"
          >
            <FaList />
            {sidebarOpen && <span>View Properties</span>}
          </button>
          <button
            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'add' ? 'bg-blue-900' : ''}`}
            onClick={() => setActiveTab('add')}
            title="Add Property"
          >
            <FaPlus />
            {sidebarOpen && <span>Add Property</span>}
          </button>
        </nav>
      </div>
      
      <div className="flex-1 p-8 bg-gray-50">
        {activeTab === 'view' && <ViewProperties />}
        {activeTab === 'add' && <AddProperty onSuccess={() => setActiveTab('view')} />}
      </div>
    </div>
  );
};

export default AgentDashboard;*/}