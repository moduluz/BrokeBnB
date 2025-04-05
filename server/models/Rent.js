const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the property'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide an address']
    },
    city: {
      type: String,
      required: [true, 'Please provide a city']
    },
    state: {
      type: String,
      required: [true, 'Please provide a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a zip code']
    }
  },
  propertyType: {
    type: String,
    required: [true, 'Please provide a property type'],
    enum: ['apartment', 'house', 'condo', 'townhouse', 'studio', 'loft']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please provide number of bedrooms'],
    min: [0, 'Number of bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please provide number of bathrooms'],
    min: [0, 'Number of bathrooms cannot be negative']
  },
  amenities: [{
    type: String
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'pending'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
RentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for common queries
RentSchema.index({ 'location.city': 1 });
RentSchema.index({ 'location.state': 1 });
RentSchema.index({ price: 1 });
RentSchema.index({ propertyType: 1 });
RentSchema.index({ status: 1 });
RentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Rent', RentSchema); 