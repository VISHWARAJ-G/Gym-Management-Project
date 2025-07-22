const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config();

const resend = new Resend(process.env.RESEND_APIKEY);

const sendTrainerEmail = async (email, name, trainerId, password) => {
  try {
    const { error } = await resend.emails.send({
      from: "Gym Admin <onboarding@resend.dev>",
      to: email,
      subject: "Your Trainer Credentials",
      html: `
        <h3>Welcome to the Gym, ${name}!</h3>
        <p>Your Trainer account has been created.</p>
        <p><strong>Trainer ID:</strong> ${trainerId}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Use these credentials to login to your dashboard.</p>
      `,
    });

    if (error) {
      console.error("❌ Failed to send trainer email:", error);
      throw new Error("Failed to send trainer email");
    }

    console.log("✅ Trainer credentials sent to:", email);
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw error;
  }
};

module.exports = sendTrainerEmail;
