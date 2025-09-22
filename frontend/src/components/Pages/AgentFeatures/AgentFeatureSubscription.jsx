import React, { useEffect, useMemo, useState } from "react";
import axios from "../../../utils/axios"; // your pre-configured axios (baseURL: /api, interceptor adds token)

export default function AgentFeatureSubscription() {
  const [me, setMe] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propsLoading, setPropsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isSubscribed = useMemo(() => {
    if (!me?.hasSubscription || !me?.subscriptionExpiry) return false;
    return new Date(me.subscriptionExpiry) > new Date();
  }, [me]);

  const isAgentApproved = useMemo(() => {
    return me?.role === "agent" && me?.isApproved === true;
  }, [me]);

  const loadMe = async () => {
    try {
      const { data } = await axios.get("/users/profile"); // BACKEND: GET /api/users/profile
      setMe(data?.user || null);
    } catch (e) {
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  const loadMyProperties = async () => {
    setPropsLoading(true);
    try {
      const { data } = await axios.get("/properties/my-properties"); // BACKEND: requires approved agent
      setProperties(Array.isArray(data?.properties) ? data.properties : []);
    } catch {
      setProperties([]);
    } finally {
      setPropsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadMe();
    })();
  }, []);

  useEffect(() => {
    if (isAgentApproved) {
      loadMyProperties();
    } else {
      setProperties([]);
      setPropsLoading(false);
    }
  }, [isAgentApproved]);

  const startSubscription = async () => {
    if (!me?._id) {
      alert("Please log in again. User not found.");
      return;
    }
    if (me.role !== "agent") {
      alert("Only agents can subscribe.");
      return;
    }
    if (!me.isApproved) {
      alert("Your agent account is not approved yet.");
      return;
    }
    try {
      setSubmitting(true);
      // BACKEND: POST /api/subscription/create-checkout-session  { agentId }
      const { data } = await axios.post("/subscription/create-checkout-session", { agentId: me._id });
      const redirectUrl = data?.url || data?.session?.url;
      if (!redirectUrl) {
        alert("Checkout URL not received from server.");
        return;
      }
      window.location.assign(redirectUrl);
    } catch (e) {
      console.error(e?.response?.data || e);
      alert(e?.response?.data?.error || "Failed to start subscription checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Loading profile…</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Feature Subscription</h2>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>
          <b>User:</b> {me?.name || "-"} ({me?.email || "-"})
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Role:</b> {me?.role || "-"} {me?.role === "agent" ? `• Approved: ${me?.isApproved ? "Yes" : "No"}` : ""}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Subscription:</b>{" "}
          {isSubscribed ? (
            <span style={{ color: "#047857" }}>
              Active until {new Date(me.subscriptionExpiry).toLocaleDateString()}
            </span>
          ) : (
            <span style={{ color: "#b91c1c" }}>Not Subscribed</span>
          )}
        </div>

        <button
          onClick={startSubscription}
          disabled={submitting || me?.role !== "agent"}
          style={{
            background: "#111827",
            color: "white",
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            cursor: submitting || me?.role !== "agent" ? "not-allowed" : "pointer"
          }}
        >
          {submitting ? "Redirecting…" : isSubscribed ? "Manage / Renew" : "Subscribe to Feature"}
        </button>

        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
          After payment, admin can approve your properties to be featured.
        </div>
      </div>

      {/* --- COMMENTED OUT MY PROPERTIES SECTION --- */}

      {/*
      <h3>My Properties</h3>
      {!isAgentApproved ? (
        <div style={{ color: "#6b7280" }}>
          {me?.role !== "agent"
            ? "Login as an agent to manage properties."
            : "Your agent account is not approved yet."}
        </div>
      ) : propsLoading ? (
        <div>Loading properties…</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {properties.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 8
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  {p.propertyType} • {p.location?.city || "Unknown city"} • ${p.price}
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isSubscribed) {
                    alert("Please subscribe first to request featuring.");
                    return;
                  }
                  alert("Request sent to admin for approval.");
                }}
                style={{
                  background: isSubscribed ? "#111827" : "#9ca3af",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none"
                }}
                disabled={!isSubscribed}
              >
                Request Featured
              </button>
            </div>
          ))}
          {properties.length === 0 && <div style={{ color: "#6b7280" }}>No properties found.</div>}
        </div>
      )}
      */}
    </div>
  );
}
