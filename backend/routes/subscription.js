// routes/subscription.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const User = require("../models/User");

const stripe = Stripe("sk_test_51RnF0w2ezcLZUOL8ue6m3diqndfqiHc6C8ruSy9KqB9DTmsXKS1MjekJze7Mg9VOkCPpYiij8EtQjAsfxpjw9Rfm00fZZT8Dja");

// ✅ Create checkout session for agent subscription
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: "Agent ID is required" });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ error: "Agent not found" });
    }

    // Ensure each agent has (and reuses) their own Stripe Customer
    let stripeCustomerId = agent.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: agent.email,
        name: agent.name,
        metadata: { agentId: agent._id.toString() }
      });
      stripeCustomerId = customer.id;
      agent.stripeCustomerId = stripeCustomerId;
      await agent.save();
    }

   const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],  // ✅ only card
  mode: "subscription",
  customer: stripeCustomerId,
  customer_update: { name: "never", address: "auto" },
  allow_promotion_codes: false,

  // 👇 Force disable Link
  payment_method_options: {
    card: {
      request_three_d_secure: "automatic", // or "any" if you want 3DS always
    },
  },

  // 👇 Only allow cards (disable wallets/Link explicitly)
  payment_method_types: ["card"],

  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Real Estate Featured Subscription",
          description: "Feature your properties for 30 days",
        },
        unit_amount: 1000, // $10/month
        recurring: { interval: "month" },
      },
      quantity: 1,
    },
  ],
  success_url: "http://localhost:5173/agent-dashboard?success=true",
cancel_url: "http://localhost:5173/agent-dashboard?canceled=true",

  metadata: { agentId },
});


    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});

module.exports = router;
