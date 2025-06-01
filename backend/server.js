require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Connection URI:', process.env.MONGO_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection URI:', process.env.MONGO_URI);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Error handling middleware with more details
app.use((err, req, res, next) => {
  console.error('Error details:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request path:', req.path);
  console.error('Request body:', req.body);

  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});