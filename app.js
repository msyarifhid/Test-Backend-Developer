// require('dotenv').config();

// const express = require('express');
// const bodyParser = require('body-parser');
// const squelize = require('./config/database');

// const User = require('./models/user');
// const Book = require('./models/book');
// const Author = require('./models/author');

const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/book');

// const app = express();

// app.use(bodyParser.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/books', bookRoutes);

// squelize.sync().then(() => {
//     const APP_PORT = process.env.PORT || 3000;
//     const APP_URL = process.env.APP_URL || `http://localhost:${APP_PORT}`;

//     app.listen(APP_PORT, () => {
//         console.log(`API running on ${APP_URL}`);
//     });
// }).catch(err => {
//     console.log('Unable to sync database:', err);
// });

// module.exports = app;

const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Export app for testing
module.exports = app;