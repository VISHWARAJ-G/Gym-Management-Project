const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTrainerEmail = async (email, name, trainerId, password) => {
  const mailOptions = {
    from: `"Gym Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Trainer Credentials",
    html: `
      <h3>Welcome to the Gym, ${name}!</h3>
      <p>Your trainer account has been created.</p>
      <p><strong>Trainer ID:</strong> ${trainerId}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Use these credentials to log in to your dashboard.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Trainer credentials sent to:", email);
  } catch (err) {
    console.error("❌ Failed to send trainer email:", err.message);
    throw err;
  }
};

module.exports = sendTrainerEmail;
