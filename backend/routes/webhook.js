// routes/webhook.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const User = require("../models/User");
const { sendSubscriptionConfirmation } = require("../utils/sendMail");

// ✅ Initialize Stripe with secret key
const stripe = Stripe("sk_test_51RnF0w2ezcLZUOL8ue6m3diqndfqiHc6C8ruSy9KqB9DTmsXKS1MjekJze7Mg9VOkCPpYiij8EtQjAsfxpjw9Rfm00fZZT8Dja") // ✅ Use env variable

// ✅ Webhook must use raw body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("📩 Incoming Stripe webhook...");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error("⚠️ Missing STRIPE_WEBHOOK_SECRET in environment");
        return res.sendStatus(500);
      }

      // Verify event with Stripe signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log("✅ Event verified:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        // -------------------------------
        // ✅ First checkout completed
        // -------------------------------
        case "checkout.session.completed": {
          const session = event.data.object;
          const agentId = session.metadata?.agentId;

          const user = await User.findById(agentId);
          if (user) {
            user.hasSubscription = true;
            user.subscriptionExpiry = new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            );
            user.stripeCustomerId = session.customer;
            user.stripeSubscriptionId = session.subscription;
            await user.save();

            console.log(`✅ Subscription activated for: ${user.email}`);
            await sendSubscriptionConfirmation(user.email, user.name);
          }
          break;
        }

        // -------------------------------
        // ✅ Subscription created
        // -------------------------------
        case "customer.subscription.created": {
          const subscription = event.data.object;
          const stripeCustomerId = subscription.customer;

          const user = await User.findOne({ stripeCustomerId });
          if (user) {
            user.hasSubscription = true;
            user.subscriptionExpiry = new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            );
            user.stripeSubscriptionId = subscription.id;
            await user.save();

            console.log(`✅ Subscription created for: ${user.email}`);
            await sendSubscriptionConfirmation(user.email, user.name);
          }
          break;
        }

        // -------------------------------
        // ✅ Subscription renewed
        // -------------------------------
        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          const stripeCustomerId = invoice.customer;
          const stripeSubscriptionId = invoice.subscription;

          const user = await User.findOne({
            $or: [{ stripeCustomerId }, { stripeSubscriptionId }],
          });

          if (user) {
            user.hasSubscription = true;
            user.subscriptionExpiry = new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            );
            await user.save();

            console.log(`✅ Subscription renewed for: ${user.email}`);
            await sendSubscriptionConfirmation(user.email, user.name);
          }
          break;
        }

        // -------------------------------
        // ⚠️ Subscription canceled / failed
        // -------------------------------
        case "customer.subscription.deleted":
        case "customer.subscription.canceled":
        case "invoice.payment_failed": {
          const data = event.data.object;
          const stripeCustomerId = data.customer || data.customer_id;
          const stripeSubscriptionId = data.id || data.subscription;

          const user = await User.findOne({
            $or: [{ stripeCustomerId }, { stripeSubscriptionId }],
          });

          if (user) {
            user.hasSubscription = false;
            await user.save();
            console.log(`⚠️ Subscription deactivated for: ${user.email}`);
          }
          break;
        }

        default:
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("❌ Webhook handler error:", err.message);
      res.sendStatus(500);
    }
  }
);

module.exports = router;




