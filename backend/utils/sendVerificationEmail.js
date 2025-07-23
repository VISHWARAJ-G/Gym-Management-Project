const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config();

const resend = new Resend(process.env.RESEND_APIKEY);

const sendVerificationEmail = async (email, verification_token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verification_token}`;

  try {
    const { error } = await resend.emails.send({
      from: "Evolve Gym <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Evolve Gym account",
      html: `
        <h2>Welcome to Evolve Gym!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="padding:10px 15px; background-color:#ffb703; color:#000; text-decoration:none; border-radius:5px;">Click here to verify</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    if (error) {
      console.error("❌ Failed to send verification email:", error);
      throw new Error("Failed to send verification email");
    }
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    throw err;
  }
};

module.exports = sendVerificationEmail;
