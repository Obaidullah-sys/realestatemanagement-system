// cron/subscriptionReminder.js
const cron = require("node-cron");
const User = require("../models/User");
const { sendSubscriptionReminder } = require("../utils/sendMail");

// Helper: days between two dates
const getDaysBetween = (a, b) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((b.setHours(0,0,0,0) - a.setHours(0,0,0,0)) / msPerDay);
};

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("🔔 Running daily subscription reminder job...");

    const today = new Date();

    // Determine last day of current month
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const isLastDay = today.getDate() === lastDayOfMonth.getDate();

    // Find all agents with subscriptions (active or expired)
    const agents = await User.find({ role: "agent" });

    for (const agent of agents) {
      const expiry = agent.subscriptionExpiry ? new Date(agent.subscriptionExpiry) : null;

      // 1) Deactivate if expired
      if (expiry && expiry < today && agent.hasSubscription) {
        agent.hasSubscription = false;
        await agent.save();
        continue;
      }

      // 2) Send expiring soon reminders
      if (expiry && expiry >= today) {
        const daysLeft = getDaysBetween(today, new Date(expiry));

        // Send reminder if:
        // - last day of the month, and expiry is within next 7 days, OR
        // - expiry within next 3 days
        if ((isLastDay && daysLeft <= 7) || daysLeft <= 3) {
          await sendSubscriptionReminder(agent.email, agent.name, daysLeft);
        }
      }
    }

    console.log("✅ Daily reminder job completed");
  } catch (err) {
    console.error("❌ Reminder job error:", err);
  }
});
