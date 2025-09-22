const nodemailer = require("nodemailer");

const sendResetEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "muhammedobaidullah4@gmail.com",
      pass: "yedhnjmplgubonlk"
    }
  });

  const resetLink = `http://localhost:5173/reset-password/${token}`; // frontend link

  const mailOptions = {
    from: '"Real Estate website" <muhammedobaidullah4@gmail.com>',
    to,
    subject: "🔒 Reset Your Password",
    text: `Click this link to reset your password:\n\n${resetLink}\n\nIt will expire in 1 hour.`
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Reset password email sent to:", to);
};

module.exports = sendResetEmail;
