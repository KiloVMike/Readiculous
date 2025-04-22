const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../modals/users'); // Assuming the model is in the 'models' folder

const router = express.Router();

// Google authentication route
router.post('/google-auth', async (req, res) => {
  const { email, displayName, uid, avatar } = req.body;

  try {
      // Check if the user already exists using googleId
      let user = await User.findOne({ googleId: uid });

      if (user) {
          // User already exists, log them in by generating a JWT token
          const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return res.status(200).json({ token });
      }

      // If the user doesn't exist, create a new user with unique username and password
      let username = displayName;
      let uniqueUsername = username;

      // Check if the username already exists and create a unique one if needed
      let usernameExists = await User.findOne({ username: uniqueUsername });
      let counter = 1;
      while (usernameExists) {
          uniqueUsername = `${username}-${counter}`;
          usernameExists = await User.findOne({ username: uniqueUsername });
          counter++;
      }

      // Create the new user with a dynamically generated username and a random password
      user = new User({
          email,
          username: uniqueUsername,  // Ensure username is unique
          googleId: uid,
          avatar,
          address: 'Not provided',  // Set default address if necessary
          role: 'user',  // Default role
          password: Math.random().toString(36).slice(-8),  // Generate a random password (optional, since it's not used for Google login)
      });

      // Save the new user
      await user.save();

      // Generate JWT token after creating the new user
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token back to the client
      res.status(200).json({ token });
  } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(500).send("Server error");
  }
});

module.exports = router;
