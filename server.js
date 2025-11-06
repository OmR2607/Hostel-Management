// server.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// Body-parsing middleware for URL-encoded and JSON data
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hostelPayment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Session configuration
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Friendly GET Routes for HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// -------------------
// POST Route for Login
// -------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // For demonstration, we'll use a simple check.
  // In a real application, fetch the user from your database
  // and use bcrypt to compare hashed passwords.
  if (username === 'admin' && password === 'password') {
    // For example, set session data
    req.session.userId = 'admin'; // or the user ID from the DB
    // Redirect to admin page or show success message
    res.send('Login Successful! (Redirect to admin or user dashboard)');
  } else {
    res.status(401).send('Invalid credentials. Please try again.');
  }
});

// (Optional) Payment API Routes and others
const paymentRoutes = require('./routes/Payment');
app.use('/api/payments', paymentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});