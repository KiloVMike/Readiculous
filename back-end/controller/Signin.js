const User = require("../modals/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.Signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const checkuser = await User.findOne({ username });

        if (!checkuser) {
            return res.status(400).json({ message: "Username not found" });
        }

        // Compare encrypted password
        bcrypt.compare(password, checkuser.password, (err, data) => {
            if (data) {
                const payload = {
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
                    id: checkuser._id,  // Unique ID
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
