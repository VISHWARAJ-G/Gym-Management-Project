const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER, 
    pass: process.env.BREVO_PASS, 
  },
});

const sendVerificationEmail = async (email, verification_token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verification_token}`;

  const mailOptions = {
    from: `"Evolve Gym" <${process.env.BREVO_USER}>`,
    to: email,
    subject: "Verify your Evolve Gym account",
    html: `
      <h2>Welcome to Evolve Gym!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" style="padding:10px 15px; background-color:#ffb703; color:#000; text-decoration:none; border-radius:5px;">Click here to verify</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    throw err;
  }
};

module.exports = sendVerificationEmail;
