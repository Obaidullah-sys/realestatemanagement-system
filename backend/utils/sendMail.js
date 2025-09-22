// utils/sendMail.js
const nodemailer = require("nodemailer");

// Single reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "muhammedobaidullah4@gmail.com",
    pass: "yedhnjmplgubonlk"
  }
});

const sendWelcomeEmail = async (to, name) => {
  try {
    const mailOptions = {
      from: '"Real-Estate Website" <muhammedobaidullah4@gmail.com>',
      to,
      subject: "🎉 Welcome to Our Website!",
      text: `Hi ${name},\n\nThank you for signing up with us! We're excited to have you on board.\n\n— Your Real-Estate Team`
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", to);
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
};

const sendSubscriptionReminder = async (to, name, daysLeft) => {
  try {
    const mailOptions = {
      from: '"Real-Estate Website" <muhammedobaidullah4@gmail.com>',
      to,
      subject: "🔔 Subscription Expiring Soon",
      text: `Hi ${name},\n\nYour subscription is expiring in ${daysLeft} day(s). Please renew to keep your properties featured.\n\n— Real-Estate Team`
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Reminder email sent to:", to);
  } catch (err) {
    console.error("❌ Reminder email error:", err);
  }
};

// ✅ Send subscription confirmation email
const sendSubscriptionConfirmation = async (email, name) => {
  const mailOptions = {
     from: '"Real-Estate Website" <muhammedobaidullah4@gmail.com>',
    to: email,
    subject: "🎉 Subscription Activated Successfully!",
    html: `<p>Hi ${name},</p>
           <p>Thank you for subscribing to our <b>Featured Properties Plan</b>!</p>
           <p>Your subscription is now active and valid for <b>30 days</b>.</p>
           <p>We’re excited to feature your properties 🚀</p>`,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = { sendWelcomeEmail, sendSubscriptionReminder , sendSubscriptionConfirmation};