const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyparser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(cors());

let otpstore = {};

app.get("/verifying", (req, res) => {
  const { username, password } = req.query;

  try {
    const fileData = fs.readFileSync("credentials.json", "utf-8");
    const users = JSON.parse(fileData);
    const userFound = users.find(
      (user) => user.username === username && user.password === password
    );

    if (userFound) {
      res.status(200).json({ message: "Login successful", user: userFound });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error reading credentials file:", error);
    res.status(500).json({ error: "Server error while reading credentials." });
  }
});

app.get("/addingUser", (req, res) => {
  try {
    const { user, mail, pass } = req.query;
    const fileData = fs.readFileSync("credentials.json", "utf-8");
    const users = JSON.parse(fileData);

    const userExists = users.find(
      (u) => u.username === user || u.email === mail
    );

    if (userExists) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = { username: user, email: mail, password: pass };
    users.push(newUser);

    fs.writeFileSync("credentials.json", JSON.stringify(users, null, 2));
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.get("/send-otp", (req, res) => {
  const { mail } = req.query;

  try {
    const userData = JSON.parse(fs.readFileSync("credentials.json", "utf-8"));

    const userFound = userData.find((user) => user.email === mail);
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User found" });
  } catch (error) {
    console.error("Error reading user data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/send-otp", (req, res) => {
  const { mail } = req.body;

  try {
    const userData = JSON.parse(fs.readFileSync("credentials.json", "utf-8"));
    const userFound = userData.find((user) => user.email === mail);

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    otpstore[mail] = otp;

    const mailContent = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: "Your OTP Code",
      text: `This is your OTP: ${otp}`,
    };
    transporter.sendMail(mailContent, (error, info) => {
      if (error) {
        console.error("Error sending mail:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      } else {
        console.log("Mail sent:", info.response);
        return res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/verify-otp", (req, res) => {
  const { mail, otp } = req.body;

  if (!mail || !otp) {
    return res.status(400).send("Email and OTP are required");
  }

  const storedOtp = otpstore[mail];
  if (!storedOtp) {
    return res.status(400).send("OTP not sent to this email address");
  }

  if (storedOtp === otp) {
    delete otpstore[mail];
    return res.status(200).send("OTP verified successfully");
  } else {
    return res.status(400).send("Invalid OTP");
  }
});

app.get("/update", async (req, res) => {
  let { password, email } = req.query;
  try {
    let readdata = JSON.parse(fs.readFileSync("credentials.json", "utf-8"));
    let data = readdata.find((user) => user.email === email);
    data.password = password;

    fs.writeFileSync("credentials.json", JSON.stringify(readdata, null, 2));
    return res.status(200).json("Updated successfully");
  } catch (error) {
    res.status(500).json("updation failed");
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
