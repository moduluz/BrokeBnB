const express = require('express');
const router = express.Router();
const Rent = require('../models/Rent');
const { upload } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new rental listing with image upload
router.post('/', verifyToken, upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || [];

    const rentalData = {
      ...req.body,
      images,
      owner: req.user.id
    };

    // Convert string values to numbers where needed
    rentalData.price = parseFloat(rentalData.price);
    rentalData.bedrooms = parseInt(rentalData.bedrooms);
    rentalData.bathrooms = parseFloat(rentalData.bathrooms);
    
    // Convert amenities string to array if it's a string
    if (typeof rentalData.amenities === 'string') {
      rentalData.amenities = rentalData.amenities.split(',').map(item => item.trim());
    }

    const rental = new Rent(rentalData);
    await rental.save();
    
    res.status(201).json(rental);
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(400).json({ 
      message: 'Error creating rental listing',
      error: error.message 
    });
  }
});

// Get all rentals with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      city,
      state,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      status = 'available'
    } = req.query;

    const query = { status };

    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (propertyType) query.propertyType = propertyType;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const rentals = await Rent.find(query)
      .sort({ createdAt: -1 })
      .populate('owner', 'name email');

    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ message: 'Error fetching rentals' });
  }
});

// Get a single rental by ID
router.get('/:id', async (req, res) => {
  try {
    const rental = await Rent.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    res.json(rental);
  } catch (error) {
    console.error('Error fetching rental:', error);
    res.status(500).json({ message: 'Error fetching rental' });
  }
});

// Update a rental listing
router.put('/:id', verifyToken, upload.array('images', 10), async (req, res) => {
  try {
    const rental = await Rent.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    // Check if the user is the owner
    if (rental.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this rental' });
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      
      // Add new images to existing ones
      rental.images = [...rental.images, ...newImages];
    }

    // Update other fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== 'images') {
        rental[key] = updates[key];
      }
    });

    await rental.save();
    res.json(rental);
  } catch (error) {
    console.error('Error updating rental:', error);
    res.status(400).json({ message: 'Error updating rental' });
  }
});

// Delete a rental listing
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const rental = await Rent.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    // Check if the user is the owner
    if (rental.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this rental' });
    }

    await rental.remove();
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental:', error);
    res.status(500).json({ message: 'Error deleting rental' });
  }
});

module.exports = router; 