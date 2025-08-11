var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

// Home page
router.get("/", function (req, res) {
  res.render("index", { title: "Portfolio" });
});

router.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Basic validations
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  // Phone number validation (10-15 digits, optional +)
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Please enter a valid phone number" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
module.exports = router;
