const User = require("../modals/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // <-- Add this line
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.Signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const checkuser = await User.findOne({ username });

        if (!checkuser) {
            return res.status(400).json({ message: "Username not found" });
        }

        console.log("Stored password hash:", checkuser.password);  // Log the stored hash
        console.log("Password being compared:", password);  // Log the input password

        // Compare encrypted password
        bcrypt.compare(password, checkuser.password, (err, data) => {
            if (data) {
                const payload = {
                    id: checkuser._id,
                    name: checkuser.username,
                    role: checkuser.role
                };

                const key = process.env.SECRETKEY;
                if (!key) {
                    return res.status(500).json({ message: "Server error: SECRETKEY is missing" });
                }

                // Create token
                const token = jwt.sign(payload, key, { expiresIn: "30d" });

                return res.status(200).json({
                    message: "Signin successful",
                    id: checkuser._id,
                    role: checkuser.role,
                    token: token
                });
            } else {
                return res.status(400).json({ message: "Signin failed - incorrect password" });
            }
        });
    } catch (error) {
        console.error("Signin Controller Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User with this email does not exist" });
      }
  
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
  
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // your Gmail
          pass: process.env.EMAIL_PASS, // your App Password
        },
      });
  
      const info = await transporter.sendMail({
        to: user.email,
        from: `"Readiculous 📖" <${process.env.EMAIL_USER}>`,
        subject: "Reset Your Password - Readiculous",
        html: `
          <h3>Password Reset</h3>
          <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
          <p>This link is valid for 1 hour.</p>
        `,
      });
  
      return res.status(200).json({ message: "Reset email sent successfully!" });
  
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

  exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);  // Hash the new password
        user.resetToken = undefined;  // Clear the reset token
        user.resetTokenExpiry = undefined;  // Clear the reset token expiry
        await user.save();  // Save the user with the new hashed password

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};