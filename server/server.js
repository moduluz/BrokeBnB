const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Import Mongoose

// Load environment variables
dotenv.config();

// --- MongoDB Connection --- 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ doesn't require these options anymore, but keeping them doesn't hurt
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB(); // Call the function to connect to the DB
// ------------------------

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust as needed for production)
app.use(express.json()); // Middleware to parse JSON request bodies

// --- Define Routes --- 
app.get('/', (req, res) => {
  res.send('RentHomeHub API is running...');
});

// Mount authentication routes
app.use('/api/auth', require('./routes/auth'));

// Mount rent routes
app.use('/api/rent', require('./routes/rent'));

// Define Port
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 