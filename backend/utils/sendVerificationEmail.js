const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendVerificationEmail = async (email, verification_token) => {
  const verificationLink = `http://localhost:5173/verify-email/${verification_token}`;
  const mailOptions = {
    from: '"Evolve Gym" <no-reply@evolvegym.com>',
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
    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent successfully");
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err;
  }
};

module.exports = sendVerificationEmail;
