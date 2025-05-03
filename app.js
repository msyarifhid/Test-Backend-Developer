const express = require('express');
const app = express();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Export app for testing
module.exports = app;