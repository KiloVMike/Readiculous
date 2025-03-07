const express = require('express');
const router = express.Router();
const User = require('../modals/users'); // Adjust path if necessary
const jwt = require('jsonwebtoken');

// POST route to handle Google sign-up or login
router.post('/google-auth', async (req, res) => {
  try {
    const { email, displayName, uid } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({
        email,
        displayName,
        googleId: uid, // You can add this if you're saving the Google ID
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token back to the client
    res.json({ token });
  } catch (error) {
    console.error('Error during Google auth:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
