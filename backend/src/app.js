const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/error.middleware');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');
const borrowRoutes = require('./routes/borrow.routes');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:4200',
  'https://backend-bookbuddy.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
// app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/borrow', borrowRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
