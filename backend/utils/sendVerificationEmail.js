const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Evolve Gym" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Evolve Gym account",
    html: `
      <h2>Welcome to Evolve Gym!</h2>
      <p>Click the button below to verify:</p>
      <a href="${link}" style="padding:10px 15px; background-color:#ffb703; color:#000; border-radius:5px;">Verify Email</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Gmail SMTP error:", err.message);
    throw err;
  }
};

module.exports = sendVerificationEmail;
