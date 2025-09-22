// src/components/Pages/AdminFeatures/AdminFeatureApproval.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../utils/axios";

export default function AdminFeatureApprovals() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/properties");
      setProperties(Array.isArray(data?.properties) ? data.properties : []);
    } catch (e) {
      console.error("Failed to load properties", e?.response?.data || e);
      alert("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Group properties by agent
  const agents = useMemo(() => {
    const now = new Date();
    const groups = new Map();
    for (const p of properties) {
      const a = p.agent || {};
      const id = a._id || a.id;
      if (!id) continue;
      const expiry = a.subscriptionExpiry ? new Date(a.subscriptionExpiry) : null;
      const isPaid = !!a.hasSubscription && expiry && expiry > now;

      if (!groups.has(id)) {
        groups.set(id, {
          agentId: id,
          name: a.name || "-",
          email: a.email || "-",
          hasSubscription: !!a.hasSubscription,
          subscriptionExpiry: expiry,
          isPaid,
          items: [],
        });
      }
      groups.get(id).items.push(p);
    }
    return Array.from(groups.values());
  }, [properties]);

  const filteredAgents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(a =>
      [a.name, a.email].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [agents, query]);

  const selectedAgent = useMemo(() => {
    if (!selectedAgentId) return null;
    return agents.find(a => a.agentId === selectedAgentId) || null;
  }, [agents, selectedAgentId]);

  const toggleFeatured = async (propertyId, isFeatured) => {
    try {
      setTogglingId(propertyId);
      await api.put(`/admin/properties/${propertyId}/feature`, { isFeatured });
      setProperties(prev =>
        prev.map(p => (p._id === propertyId ? { ...p, isFeatured } : p))
      );
    } catch (e) {
      console.error("Failed to update feature flag", e?.response?.data || e);
      alert(e?.response?.data?.error || "Failed to update feature flag");
    } finally {
      setTogglingId(null);
    }
  };

  // Agent card
  const AgentRow = ({ agent }) => {
    const expiryText = agent.subscriptionExpiry
      ? agent.subscriptionExpiry.toLocaleDateString()
      : "-";
    return (
      <button
        onClick={() => setSelectedAgentId(agent.agentId)}
        className={`w-full text-left border rounded-lg p-4 shadow-sm transition hover:shadow-md ${
          agent.isPaid ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
        }`}
      >
        <div className="text-sm">
          Agent: <b>{agent.name}</b> ({agent.email}) <br />
          <span className={agent.isPaid ? "text-green-700" : "text-red-700"}>
            {agent.isPaid ? `Subscribed until ${expiryText}` : "Not Subscribed"}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Properties: {agent.items.length}
        </div>
      </button>
    );
  };

  // Property card
  const PropertyRow = ({ p }) => {
    const canToggle = togglingId !== p._id;
    const city = p.location?.city;
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm grid grid-cols-[1fr_auto] gap-4 items-center">
        <div>
          <div className="font-semibold">{p.title}</div>
          <div className="text-sm text-gray-600">
            {p.propertyType} • {city || "Unknown"} • ${p.price}
          </div>
          <div
            className={`mt-2 text-xs ${
              p.isFeatured ? "text-green-600" : "text-purple-600"
            }`}
          >
            {p.isFeatured ? "Featured (approved)" : "Not Featured (pending approval)"}
          </div>
        </div>
        <div>
          {!p.isFeatured ? (
            <button
              onClick={() => toggleFeatured(p._id, true)}
              disabled={!canToggle}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {togglingId === p._id ? "Approving..." : "Approve Featured"}
            </button>
          ) : (
            <button
              onClick={() => toggleFeatured(p._id, false)}
              disabled={!canToggle}
              className="border px-4 py-2 rounded-md disabled:opacity-50"
            >
              {togglingId === p._id ? "Removing..." : "Remove Featured"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {!selectedAgent && (
        <>
          <h2 className="text-xl font-bold mb-4">Agents</h2>
          <div className="flex gap-3 mb-6">
            <input
              placeholder="Search agent name or email…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="border rounded px-3 py-2 w-72"
            />
            <button
              onClick={loadProperties}
              disabled={loading}
              className="bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div>Loading…</div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-red-700">Not Subscribed</h3>
                <div className="grid gap-3">
                  {filteredAgents
                    .filter(a => !a.isPaid)
                    .map(a => (
                      <AgentRow key={a.agentId} agent={a} />
                    ))}
                  {filteredAgents.filter(a => !a.isPaid).length === 0 && (
                    <div className="text-gray-500 text-sm">No agents found.</div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-green-700">Subscribed</h3>
                <div className="grid gap-3">
                  {filteredAgents
                    .filter(a => a.isPaid)
                    .map(a => (
                      <AgentRow key={a.agentId} agent={a} />
                    ))}
                  {filteredAgents.filter(a => a.isPaid).length === 0 && (
                    <div className="text-gray-500 text-sm">No agents found.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {selectedAgent && (
        <>
          <button
            onClick={() => setSelectedAgentId(null)}
            className="mb-4 border px-3 py-1 rounded-md bg-white"
          >
            ← Back to Agents
          </button>

          <div className="mb-4">
            <div className="font-semibold text-lg">
              Agent: {selectedAgent.name} ({selectedAgent.email})
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Subscribed:{" "}
              <b>{selectedAgent.isPaid ? "Yes" : "No"}</b>
              {selectedAgent.isPaid && selectedAgent.subscriptionExpiry
                ? ` (until ${selectedAgent.subscriptionExpiry.toLocaleDateString()})`
                : ""}
            </div>
          </div>

          <div className="grid gap-4">
            {selectedAgent.items.map(p => (
              <PropertyRow key={p._id} p={p} />
            ))}
            {selectedAgent.items.length === 0 && (
              <div className="text-gray-500 text-sm">No properties for this agent.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
