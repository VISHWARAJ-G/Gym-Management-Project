const express = require("express");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../services/supabaseClient");
const router = express.Router();
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");
const generateRandomPassword = require("../utils/generatePassword");
const sendTrainerEmail = require("../utils/sendTrainerMail");
const PDFDocument = require("pdfkit");
const validator = require("validator");
const disposableDomains = require("disposable-email-domains");
const dns = require("dns/promises");
const axios = require("axios");

dotenv.config();

async function isValidMX(email) {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (err) {
    return false;
  }
}

async function isInboxDeliverable(email) {
  try {
    const res = await axios.get(`https://apilayer.net/api/check`, {
      params: {
        access_key: process.env.MAILBOX_APIKEY,
        email: email,
        smtp: 1,
        format: 1,
      },
    });

    return res.data.smtp_check === true && res.data.format_valid === true;
  } catch (err) {
    console.error("Email API Error:", err.message);
    return false;
  }
}

router.post("/signup-user", async (req, res) => {
  const {
    name,
    age,
    gender,
    dob,
    address,
    phone,
    email,
    password,
    role = "user",
  } = req.body;

  const emailDomain = email.split("@")[1]?.toLowerCase();

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (disposableDomains.includes(emailDomain)) {
    return res
      .status(400)
      .json({ message: "Disposable email addresses are not allowed" });
  }

  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("email")
    .eq("email", email);
  if (existingUser.length > 0) {
    return res.status(409).json({ message: "User already exists" });
  }
  if (findError) {
    return res
      .status(500)
      .json({ message: "Error checking user", error: findError });
  }

  const verification_token = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("inactive_users").insert([
    {
      name,
      age,
      gender,
      dob,
      address,
      phone,
      email,
      password: hashedPassword,
      role,
      is_verified: false,
      verification_token,
    },
  ]);
  if (error) {
    return res.status(500).json({ message: "Signup Failed", error });
  }
  try {
    await sendVerificationEmail(email, verification_token);
    return res.status(201).json({
      message: "Signup Successful. Check you Email to Verify your Account",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to send email", error: err });
  }
});

router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  const { data: user, error } = await supabase
    .from("inactive_users")
    .select("*")
    .eq("verification_token", token)
    .single();

  if (error || !user) {
    return res.status(400).json({ message: "Invalid or Expired Token" });
  }

  const { error: UpdateError } = await supabase.from("users").insert([
    {
      id: user.id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      dob: user.dob,
      address: user.address,
      phone: user.phone,
      email: user.email,
      password: user.password,
      status: "active",
      is_verified: true,
      verification_token: null,
      role: user.role,
      payment_status: user.payment_status || "inactive",
    },
  ]);

  if (UpdateError) {
    return res.status(500).json({ message: "Failed to Verify" });
  }

  const { error: deleteError } = await supabase
    .from("inactive_users")
    .delete()
    .eq("id", user.id);

  if (deleteError) {
    return res.status(500).json({
      message: "Failed to delete from Inactive Users Table.",
    });
  }

  return res.status(200).json({ message: "Email Verified" });
});

router.post("/resend-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.is_verified) {
    return res.status(409).json({ message: "User already verified" });
  }

  const newToken = uuidv4();

  const { error: updateError } = await supabase
    .from("users")
    .update({ verification_token: newToken })
    .eq("id", user.id);

  if (updateError) {
    return res.status(500).json({ message: "Error updating token" });
  }

  try {
    await sendVerificationEmail(email, newToken);
    return res.status(200).json({ message: "Verification email resent" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to send email", error: err });
  }
});

router.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error: newError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user && newError) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  if (!user.is_verified) {
    return res.status(403).json({ message: "Please Verify your Email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const payload = {
    id: user.id,
    name: user.name,
    age: user.age,
    dob: user.dob,
    phone: user.phone,
    email: user.email,
    status: user.status,
    role: user.role,
    address: user.address,
    gender: user.gender,
    payment_status: user.payment_status,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "5d",
  });
  return res.status(201).json({
    message: "Login Successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      age: user.age,
      dob: user.dob,
      phone: user.phone,
      email: user.email,
      status: user.status,
      role: user.role,
      address: user.address,
      gender: user.gender,
      payment_status: user.payment_status,
    },
  });
});

router.post("/login-trainer", async (req, res) => {
  const { trainer_id, password } = req.body;
  const { data: trainer, error: newError } = await supabase
    .from("trainer")
    .select("*")
    .eq("trainer_id", trainer_id)
    .single();
  if (!trainer) {
    return res.status(401).json({ message: "No Trainer Found" });
  }
  if (newError) {
    return res.status(401).json({ message: "Failed to fetch details" });
  }
  if (trainer.role === "Admin") {
    if (password !== trainer.password) {
      return res
        .status(401)
        .json({ message: "Invalid Trainer ID or Password" });
    }
    const payload = {
      id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      role: trainer.role,
    };
    const adminToken = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "5d",
    });
    return res.status(201).json({
      message: "Admin Login Successful",
      adminToken,
      admin: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        role: trainer.role,
      },
    });
  } else if (trainer.role === "trainer") {
    const isMatch = await bcrypt.compare(password, trainer.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid Trainer ID or Password" });
    }

    const payload = {
      trainer_id: trainer.trainer_id,
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      role: trainer.role,
    };
    const trainerToken = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "5d",
    });
    return res.status(201).json({
      message: "Trainer Login Successful",
      trainerToken,
      trainer: {
        trainer_id: trainer.trainer_id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        role: trainer.role,
      },
    });
  }
});

router.post("/payment-gateway", async (req, res) => {
  const { plan_name, plan_amount, plan_duration } = req.body;

  const token = req.headers.authorization?.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized user", error: err });
  }

  const user_id = decoded.id;

  const { data: UserExists, error: findExistsError } = await supabase
    .from("subscribe")
    .select("user_id")
    .eq("user_id", user_id)
    .in("status", ["active", "expiring"]);

  if (findExistsError) {
    return res.status(500).json({
      message: "Failed to check existing subscription",
      error: findExistsError,
    });
  }

  if (UserExists && UserExists.length > 0) {
    return res
      .status(409)
      .json({ message: "User Already Has an Active/Expiring Plan" });
  }

  const { data: PlanData, error: FindPlanError } = await supabase
    .from("plans")
    .select("*")
    .eq("plan_name", plan_name)
    .single();

  if (!PlanData || FindPlanError) {
    return res.status(401).json({ message: "Plan not Found" });
  }

  const { data: Trainers, error: FindTrainerError } = await supabase
    .from("trainer")
    .select("trainer_id");

  if (!Trainers || FindTrainerError || Trainers.length === 0) {
    return res.status(401).json({ message: "Trainer not Found" });
  }

  const trainer_id =
    Trainers[Math.floor(Math.random() * Trainers.length)].trainer_id;

  const start = new Date();
  start.setDate(start.getDate() + 5);
  const start_date = start.toISOString().split("T")[0];

  const endDateObj = new Date(start_date);
  endDateObj.setDate(endDateObj.getDate() + plan_duration);
  const end_date = endDateObj.toISOString().split("T")[0];

  const database_data = {
    user_id,
    plan_id: PlanData.plan_id,
    trainer_id,
    start_date,
    end_date,
  };

  const { data, insertError } = await supabase
    .from("subscribe")
    .insert([database_data])
    .select();

  if (insertError)
    return res
      .status(500)
      .json({ message: "Insert Error", error: insertError });
  try {
    return res
      .status(201)
      .json({ message: "Subscribed Successfully", DBData: database_data });
  } catch (err) {
    res.status(500).json({ message: "Subscription Failed", error: err });
  }
});

router.post("/refresh-token", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPayload = {
      id: user.id,
      name: user.name,
      age: user.age,
      dob: user.dob,
      phone: user.phone,
      email: user.email,
      status: user.status,
      role: user.role,
    };

    const newToken = jwt.sign(newPayload, process.env.JWT_KEY, {
      expiresIn: "5d",
    });

    return res.status(200).json({ token: newToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token", error: err });
  }
});

router.get("/payment-success", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded_token = jwt.verify(token, process.env.JWT_KEY);
    const { data: paidUser, error } = await supabase
      .from("subscribe")
      .select(
        `start_date,plans:plan_id (
      plan_name,plan_amount,plan_duration_label)`
      )
      .eq("user_id", decoded_token.id)
      .single();

    if (error) return res.status(500).json({ message: "Supabase Error" });
    if (!paidUser) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User Found", paidUser });
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request", error: err });
  }
});

router.get("/paid-dashboard", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  let decoded_token;
  try {
    decoded_token = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }

  try {
    const { data: paidUserDetails, error: findPaidUserError } = await supabase
      .from("subscribe")
      .select(
        `start_date,end_date,status,plans:plan_id(plan_name,plan_amount), trainer:trainer_id(name,phone)`
      )
      .eq("user_id", decoded_token.id)
      .in("status", ["active", "expiring"])
      .single();
    if (findPaidUserError)
      return res.status(500).json({ message: "Supabase Error" });
    if (!paidUserDetails)
      return res.status(404).json({ message: "No User Found" });

    const { data: userDaysLeft, error: findUserDaysLeft } = await supabase
      .from("subscribe_with_days_left")
      .select(`days_left`)
      .eq("user_id", decoded_token.id)
      .gte("end_date", new Date().toISOString().split("T")[0])
      .single();

    if (findUserDaysLeft)
      return res.status(500).json({ message: "Supabase Error" });
    if (!userDaysLeft)
      return res.status(404).json({ message: "No Days Found" });

    return res.status(200).json({
      message: "Paid User Found",
      paidUserDetails,
      days_left: userDaysLeft.days_left,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid Request", err });
  }
});

router.get("/admin-details", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }

  try {
    const { count: totalMembers, error: CountError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    if (CountError) {
      return res.status(500).json({ message: "Supabase Error" });
    }

    const { count: activeMembers, error: activeError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "active");
    if (activeError) {
      return res.status(500).json({ message: "Supabase Error" });
    }

    const { count: expiredMembers, error: expiredError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("status", "expiring");
    if (expiredError) {
      return res.status(500).json({ message: "Supabase Error" });
    }

    const { data, error: paymentError } = await supabase
      .from("subscribe")
      .select("plan_id!inner(plan_amount)");

    if (paymentError) {
      console.error("Supabase error:", paymentError);
      return res
        .status(500)
        .json({ message: "Supabase join failed", paymentError });
    }

    const totalRevenue = data.reduce(
      (sum, entry) => sum + (entry.plan_id?.plan_amount || 0),
      0
    );

    return res.status(200).json({
      message: "Found",
      totalMembers,
      activeMembers,
      expireMembers: expiredMembers,
      revenue: totalRevenue,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Unexpected server error", err });
  }
});

router.get("/recent-activity", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token", err });
  }

  try {
    const { data: activities, error } = await supabase
      .from("subscribe")
      .select(
        `
        created_at,
        status,
        users:user_id(name),
        plans:plan_id(plan_name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) {
      return res.status(500).json({ message: "Supabase error", error });
    }
    return res.status(200).json({ activities });
  } catch (error) {
    return res.status(500).json({ message: "Unexpected error", error });
  }
});

router.get("/download-users", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("name,age,gender,dob,address,phone,email,status");
    if (error) {
      return res.status(500).json({ message: "Supabase Error" });
    }
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Users");
    const buffer = xlsx.write(workbook, { type: "buffer", book: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename = UsersList.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Excel generation error:", err);
    res.status(500).json({ message: "Server error", err });
  }
});

router.get("/download-trainers", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }

  try {
    const { data, error } = await supabase
      .from("trainer")
      .select("trainer_id,name,email,age,gender,address,phone,dob,aadhar")
      .neq("role", "Admin");
    if (error) {
      return res.status(500).json({ message: "Supabase Error" });
    }
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Trainers");
    const buffer = xlsx.write(workbook, { type: "buffer", book: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename = TrainersList.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Excel generation error:", err);
    res.status(500).json({ message: "Server error", err });
  }
});

router.get("/users-list", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }

  try {
    const { data: userTrainer, err } = await supabase
      .from("active_user_trainer")
      .select("*")
      .order("user_id");
    if (err) {
      return res.status(500).json({ message: "Supabase error", err });
    }
    res.status(200).json({ message: "Users found", userTrainer });
  } catch (err) {
    console.error("error:", err);
    return res.status(500).json({ message: "Unexpected error", err });
  }
});

router.get("/trainers-list", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }

  try {
    const { data: trainersData, error } = await supabase
      .from("trainer")
      .select("trainer_id,name,dob,email,phone,address,gender,age,aadhar")
      .neq("role", "Admin")
      .order("trainer_id", { ascending: true });
    if (error) {
      return res.status(500).json({ message: "Supabase error", error });
    }
    res.status(200).json({ message: "Trainers Found", trainersData });
  } catch (err) {
    console.error("error:", err);
    return res.status(500).json({ message: "Unexpected error", err });
  }
});

router.post("/signup-trainer", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }
  try {
    const { name, email, age, gender, phone, dob, address, aadhar } = req.body;

    const { data: existingTrainer, error: findError } = await supabase
      .from("trainer")
      .select("email, phone, aadhar")
      .or(`email.eq.${email},phone.eq.${phone},aadhar.eq.${aadhar}`);

    if (findError) {
      return res
        .status(500)
        .json({ message: "Error checking user", error: findError });
    }
    if (existingTrainer.length > 0) {
      const existing = existingTrainer[0];
      if (existing.email === email) {
        return res.status(409).json({ message: "Email already registered" });
      }
      if (existing.phone === phone) {
        return res
          .status(409)
          .json({ message: "Phone number already registered" });
      }
      if (existing.aadhar === aadhar) {
        return res
          .status(409)
          .json({ message: "Aadhar number already registered" });
      }
    }

    const { data, error } = await supabase
      .from("trainer")
      .select("trainer_id")
      .order("trainer_id", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error("Failed to fetch last trainer_id: " + error.message);
    }
    let nextNumber = 1;
    if (data.length > 0) {
      const lastId = data[0].trainer_id;
      const lastNumber = parseInt(lastId.replace("TR", ""));
      nextNumber = lastNumber + 1;
    }
    const nextTrainerId = `TR${nextNumber.toString().padStart(3, "0")}`;
    const password = generateRandomPassword();

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase.from("trainer").insert([
      {
        trainer_id: nextTrainerId,
        name,
        password: hashedPassword,
        email,
        age,
        gender,
        address,
        phone,
        dob,
        aadhar,
      },
    ]);
    if (insertError) {
      return res.status(500).json({ message: "Signup Failed", error });
    }
    await sendTrainerEmail(email, name, nextTrainerId, password);
    return res.status(200).json({
      message: "Trainer Signed up Successfully",
      trainer_id: nextTrainerId,
    });
  } catch (err) {
    console.error("error:", err);
    return res.status(500).json({ message: "Unexpected error", err });
  }
});

router.patch("/update-users/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization Token is Missing or Invalid" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token", error });
  }

  try {
    const userUpdateData = req.body;
    const { id } = req.params;
    if (Object.keys(userUpdateData).length === 0)
      return res.status(400).json({ message: "No Field to Update" });
    const { error } = await supabase
      .from("users")
      .update(userUpdateData)
      .eq("id", id);
    if (error) return res.status(500).json({ message: "Update Error", error });

    const { data: userData, err } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    const payload = {
      id: userData.id,
      name: userData.name,
      age: userData.age,
      dob: userData.dob,
      phone: userData.phone,
      email: userData.email,
      status: userData.status,
      role: userData.role,
      address: userData.address,
      gender: userData.gender,
      payment_status: userData.payment_status,
    };
    const token = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "5d",
    });
    return res.status(200).json({
      message: "User Updated Successfully",
      token,
      user: {
        id: userData.id,
        name: userData.name,
        age: userData.age,
        dob: userData.dob,
        phone: userData.phone,
        email: userData.email,
        status: userData.status,
        role: userData.role,
        address: userData.address,
        gender: userData.gender,
        payment_status: userData.payment_status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Update Failed", error });
  }
});

router.patch("/update-trainers/:trainer_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization Token is Missing or Invalid" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token", error });
  }

  try {
    const trainerUpdateData = req.body;
    const { trainer_id } = req.params;
    if (Object.keys(trainerUpdateData).length === 0)
      return res.status(400).json({ message: "No Field to Update" });
    const { data, error } = await supabase
      .from("trainer")
      .update(trainerUpdateData)
      .eq("trainer_id", trainer_id);
    if (error) return res.status(500).json({ message: "Update Error", error });
    return res.status(200).json({
      message: "Trainer updated successfully",
      updatedTrainer: data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Trainer Update Failed", err });
  }
});

router.delete("/delete-trainer/:trainer_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token was missing or invalid" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  try {
    const { trainer_id } = req.params;

    const { error } = await supabase
      .from("trainer")
      .delete()
      .eq("trainer_id", trainer_id);

    if (error) {
      console.error("Supabase deletion error:", error);
      return res.status(500).json({ message: "Delete Failed", error });
    }
    return res.status(200).json({ message: "Trainer Deleted Successfully" });
  } catch (err) {
    console.error("Unexpected Error:", err);
    return res.status(500).json({ message: "Trainer Delete Failed", err });
  }
});

router.get("/trainersID-list", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }

  try {
    const { data: trainersData, error } = await supabase
      .from("trainer")
      .select("trainer_id,name")
      .neq("role", "Admin")
      .order("trainer_id,name", { ascending: true });
    if (error) {
      return res.status(500).json({ message: "Supabase error", error });
    }
    res
      .status(200)
      .json({ message: "Trainers Found", trainerIDs: trainersData });
  } catch (err) {
    console.error("error:", err);
    return res.status(500).json({ message: "Unexpected error", err });
  }
});

router.patch("/update-usertrainers/:user_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization Token is Missing or Invalid" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token", error });
  }

  try {
    const userUpdateData = req.body;
    const { user_id } = req.params;
    if (Object.keys(userUpdateData).length === 0)
      return res.status(400).json({ message: "No Field to Update" });
    const { error } = await supabase
      .from("subscribe")
      .update(userUpdateData)
      .eq("user_id", user_id);
    if (error) return res.status(500).json({ message: "Update Error", error });
    return res.status(200).json({ message: "User Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Update Failed", error });
  }
});

router.get("/member-count/:trainer_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization Token is Missing or Invalid" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  try {
    const { trainer_id } = req.params;
    const { error, count } = await supabase
      .from("subscribe")
      .select("*", { count: "exact", head: true })
      .eq("trainer_id", trainer_id);
    if (error) {
      return res
        .status(500)
        .json({ message: "Failed to get count", error: error });
    }
    return res
      .status(200)
      .json({ message: "Fetch Count Success", trainer_id, count });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", err });
  }
});

router.get("/member-detail-count/:trainer_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization Token is Missing or Invalid" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  try {
    const { trainer_id } = req.params;
    const { count: membersCount, error } = await supabase
      .from("subscribe")
      .select("*", { count: "exact", head: true })
      .eq("trainer_id", trainer_id);
    if (error) {
      return res
        .status(500)
        .json({ message: "Failed to get count", error: error.message });
    }
    const { count: activeMembersCount, error: activeMembersError } =
      await supabase
        .from("subscribe")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", trainer_id)
        .eq("status", "active");
    if (activeMembersError) {
      return res
        .status(500)
        .json({ message: "Failed to get count", error: activeMembersError });
    }
    const { count: renewalMemberCount, error: renewalMemberError } =
      await supabase
        .from("subscribe")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", trainer_id)
        .eq("status", "expired");
    if (renewalMemberError) {
      return res
        .status(500)
        .json({ message: "Failed to get count", error: renewalMemberError });
    }

    return res.status(200).json({
      message: "Member details Found",
      membersCount,
      activeMembersCount,
      renewalMemberCount,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", err });
  }
});

router.get("/member-section/:trainer_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization Token is Missing or Invalid" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  try {
    const { trainer_id } = req.params;
    const { data: memberDetails, error: memberDetailError } = await supabase
      .from("subscribe")
      .select(`status,users:user_id(name,phone),plans:plan_id(plan_name)`)
      .eq("trainer_id", trainer_id);
    if (memberDetailError) {
      return res
        .status(500)
        .json({ message: "Failed to get count", error: renewalMemberError });
    }
    return res.status(200).json({
      message: "Member details Found",
      memberDetails,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", err });
  }
});

router.delete("/del-user/:userid", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "Authorization Token is Missing or Invalid" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  try {
    const { userid } = req.params;
    const { error } = await supabase.from("users").delete().eq("id", userid);
    if (error) {
      return res.status(500).json({ message: "Failed to Delete", error });
    }
    return res.status(200).json({
      message: "Deleted User Successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

router.get("/download-pdf/:id", async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(authHeader.split(" ")[1], process.env.JWT_KEY);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: "User not found" });
    }
    let trainerName = "N/A";
    const { data: subscribe } = await supabase
      .from("subscribe")
      .select("trainer_id")
      .eq("user_id", id)
      .single();
    if (subscribe?.trainer_id) {
      const { data: trainer } = await supabase
        .from("trainer")
        .select("name")
        .eq("trainer_id", subscribe.trainer_id)
        .single();
      trainerName = trainer?.name || "N/A";
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.name.replace(" ", "_")}_profile.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc
      .fontSize(22)
      .text("User Profile Summary", { align: "center" })
      .moveDown(2);

    const drawRow = (label, value) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(`${label}:`, { continued: true });
      doc.font("Helvetica").text(` ${value}`).moveDown();
    };

    drawRow("Name", user.name);
    drawRow("Email", user.email);
    drawRow("Phone", user.phone || "N/A");
    drawRow("Gender", user.gender || "N/A");
    drawRow("DOB", new Date(user.dob).toLocaleDateString("en-US") || "N/A");
    drawRow("Status", user.status);
    drawRow("Payment Status", user.payment_status);
    drawRow("Assigned Trainer", trainerName);

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
