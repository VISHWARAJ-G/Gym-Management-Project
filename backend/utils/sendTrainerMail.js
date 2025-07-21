const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

async function sendTrainerEmail(email, name, trainerId, password) {
  try {
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

    const mailOptions = {
      from: `"Gym Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Trainer Credentials",
      html: `
        <h3>Welcome to the Gym, ${name}!</h3>
        <p>Your Trainer account has been created.</p>
        <p><strong>Trainer ID:</strong> ${trainerId}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Use these credentials to login to your dashboard.</p>
      `,
    };

    await transporter.verify();
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
}

module.exports = sendTrainerEmail;
