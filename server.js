const express = require('express'); // Importing the Express framework for building web applications
const path = require('path'); // Importing the path module for handling file and directory paths
const fs = require('fs'); // Importing the file system module for reading and writing files
const app = express(); // Creating an instance of an Express application
const morgan = require('morgan'); // Import Morgan for logging HTTP requests
const rateLimit = require('express-rate-limit'); // Import express-rate-limit for rate limiting
const compression = require('compression'); // Import compression middleware to compress response bodies
const cors = require('cors'); // Import CORS for enabling Cross-Origin Resource Sharing
const PORT = 8090; // Defining the port number for the server

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to log HTTP requests
app.use(morgan('dev')); // Use Morgan to log requests in a predefined format
// Middleware to compress responses
app.use(compression()); // Use compression to reduce the size of the response body
// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Set the time window for rate limiting (15 minutes)
  max: 300 // Limit each IP to 300 requests per windowMs
});
app.use(limiter); // Apply the rate limiting middleware
app.use(cors()); //  Allows external access

// Import middlewares
const errorHandler = require('./middlewares/errorHandler'); 

// Middleware to handle JSON and URL-encoded data
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse incoming requests with URL-encoded payloads/form submission

// Serve static files (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/api/images', express.static(path.join(__dirname, 'public/images')));
// app.use('/api/css', express.static(path.join(__dirname, 'public/css')));

// Import API routes from apiRoutes.js
const apiRoutes = require('./api/apiRoutes');
app.use('/api', apiRoutes); // Mount the API routes under the `/api` path

// Render Sign-Up Page
app.get('/', (req, res) => {
  res.render('signup', { errorMessage: '' });  // Pass errorMessage as an empty string
});


// Render Sign-In Page
app.get('/api/signin', (req, res) => {
  res.render('signin', { errorMessage: '' });
});

// Render Home Page
app.get('/api/home', (req, res) => {
  res.render('home');
});
app.get('/api/booking', (req, res) => {
  res.render('booking');
});

// Render Contact Us Page
app.get('/api/contact_us', (req, res) => {
  res.render('contact_us');
});



// Render Gallery Page
app.get('/api/gallery', (req, res) => {
  res.render('gallery');
});

app.get('/api/email', (req, res) => {
  res.render('email');
});

// Render Travel Page
app.get('/api/travels', (req, res) => {
  res.render('travels');
});

// Get users from users.json
app.get('/api/users', (req, res) => {
  fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to read users file' });
      }
      const users = JSON.parse(data); // Convert JSON string to JavaScript object
      res.json(users); // Send the users as JSON response
  });
});

// Use error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
