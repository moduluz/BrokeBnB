const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// --- Registration Route --- 
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation (more robust validation can be added)
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }
  
  if (password.length < 8) {
     return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Create a new user instance (password will be hashed by the pre-save hook)
    user = new User({
      name,
      email,
      password, // Pass the plain password, hashing is handled by the model
    });

    // 3. Save the user to the database
    await user.save();

    // 4. Respond with success (don't send back password hash)
    // Optionally, you could generate a token here and log the user in immediately
    res.status(201).json({ 
        message: 'User registered successfully', 
        // Optionally return some user data (excluding password)
        // userId: user._id 
    }); 

  } catch (error) {
    console.error('Registration Error:', error.message);
    // Handle potential Mongoose validation errors more gracefully
     if (error.name === 'ValidationError') {
        // Extract validation messages
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// --- Login Route --- 
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // 1. Find user by email (include password for comparison)
    // We need .select('+password') because it's excluded by default in the schema
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if user exists
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Generic message
    }

    // 3. Compare submitted password with stored hash using the model method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Generic message
    }

    // 4. User authenticated, generate JWT
    const payload = {
      user: {
        id: user.id, // Use user.id (Mongoose virtual getter for _id)
        // You can include other non-sensitive info if needed, like name or roles
        email: user.email,
        name: user.name,
      },
    };

    console.log('JWT Secret (Signing):', process.env.JWT_SECRET); // ADD THIS LINE

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Use the secret from .env
      { expiresIn: '1h' }, // Token expiration (e.g., 1 hour, '7d' for 7 days)
      (err, token) => {
        if (err) throw err;
        
        // 5. Send token and user data (excluding password) back to client
        res.json({ 
          token, 
          user: { // Return user details needed by the frontend context
              id: user.id,
              name: user.name,
              email: user.email,
              // Add any other fields the frontend needs
          }
        });
      }
    );

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router; 