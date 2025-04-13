
const express = require('express'); // Importing the Express framework
const path = require('path'); // Importing the path module for handling file paths
const fs = require('fs'); // Importing the file system module for reading and writing files
const router = express.Router(); // Creating a new router object for handling routes

// File path for users.json
const usersFilePath = path.join(__dirname, '../users.json'); // Constructing the path to the users.json file located one directory up from the current directory
const bookingsFilePath = path.join(__dirname, '../bookings.json');
// Sign-Up Route (Saves User Data)
router.post('/signup', (req, res, next) => { // Defining a POST route for user sign-up
  const { username, email, password } = req.body; // Destructuring the request body to get username, email, and password

  // Check if all required fields are provided
  if (!username || !email || !password) { // If any of the fields are missing
    return res.status(400).render('signup', { errorMessage: 'All fields are required.' }); // Respond with 400 and render with error message
  }

  // Read existing user data from users.json
  fs.readFile(usersFilePath, 'utf-8', (err, data) => { // Asynchronously read the users.json file
    if (err) return next(err); // If there's an error reading the file, pass the error to the next middleware

    let users = []; // Initialize an empty array to hold user data
    if (data) { // If data is read successfully
      users = JSON.parse(data); // Parse the JSON data into a JavaScript object
    }

    // Check if the user already exists
    const userExists = users.find(u => u.email === email); // Search for a user with the same email
    
    if (userExists) { // If a user with that email already exists
        return res.status(400).render('signup', { errorMessage: 'User already exists. Please sign in.' }); // Respond with 400 and render with error message
    }

    // Add new user and save
    const newUser  = { username, email, password }; // Create a new user object with the provided data
    users.push(newUser ); // Add the new user to the users array

    // Write the updated users array back to users.json
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => { // Asynchronously write the updated users array to the file
      if (err) return next(err); // If there's an error writing the file, pass the error to the next middleware
      res.status(302).redirect('/api/signin'); //  Respond with 302 and redirect to `/api/signin` after successful sign-up
    });
  });
});

// Sign-In Route (Verifies Credentials)
router.post('/signin', (req, res, next) => { // Defining a POST route for user sign-in
  const { email, password } = req.body; // Destructuring the request body to get email and password

  // Read existing user data from users.json
  fs.readFile(usersFilePath, 'utf-8', (err, data) => { // Asynchronously read the users.json file
    if (err) return next(err); // If there's an error reading the file, pass the error to the next middleware

    const users = JSON.parse(data); // Parse the JSON data into a JavaScript object
    // Check if the user exists with the provided email and password
    const user = users.find(u => u.email === email && u.password === password); // Search for a user with matching email and password

    if (user) { // If a matching user is found
      res.status(302).redirect('/api/home'); // Respond with 302 and redirect to `/home` after successful sign-in
    } else { // If no matching user is found
      return res.status(401).render('signin', { errorMessage: 'Invalid email or password.' }); // Respond with 401 and render with error message
    }
  });
});

router.post('/book', (req, res, next) => {
  const { name, email, destination, date, people } = req.body;

  // Validate form input
  if (!name || !email || !destination || !date || !people) {
    return res.render('book', {
      errorMessage: 'Please fill in all fields.',
      successMessage: ''
    });
  }

  // Read existing bookings
  fs.readFile(bookingsFilePath, 'utf-8', (err, data) => {
    if (err) return next(err);

    let bookings = [];
    if (data) {
      bookings = JSON.parse(data);
    }

    const newBooking = {
      name,
      email,
      destination,
      date,
      people
    };

    bookings.push(newBooking);

    fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), (err) => {
      if (err) return next(err);

      // Show confirmation message
      res.render('book', {
        successMessage: 'Trip booked successfully!',
        errorMessage: ''
      });
    });
  });
});


module.exports = router; // Exporting the router to be used in other parts of the application






// const express = require('express'); // Importing the Express framework
// const path = require('path'); // Importing the path module for handling file paths
// const fs = require('fs'); // Importing the file system module for reading and writing files
// const router = express.Router(); // Creating a new router object for handling routes

// // File path for users.json
// const usersFilePath = path.join(__dirname, '../users.json'); // Constructing the path to the users.json file located one directory up from the current directory

// // Sign-Up Route (Saves User Data)
// router.post('/signup', (req, res, next) => { // Defining a POST route for user sign-up
//   const { username, email, password } = req.body; // Destructuring the request body to get username, email, and password

//   // Check if all required fields are provided
//   if (!username || !email || !password) { // If any of the fields are missing
//     return res.status(400).send('All fields are required.'); // Respond with a 400 Bad Request status and an error message
//   }

//   // Read existing user data from users.json
//   fs.readFile(usersFilePath, 'utf-8', (err, data) => { // Asynchronously read the users.json file
//     if (err) return next(err); // If there's an error reading the file, pass the error to the next middleware

//     let users = []; // Initialize an empty array to hold user data
//     if (data) { // If data is read successfully
//       users = JSON.parse(data); // Parse the JSON data into a JavaScript object
//     }

//     // Check if the user already exists
//     const userExists = users.find(u => u.email === email); // Search for a user with the same email
    
//     if (userExists) { // If a user with that email already exists
//         return res.status(400).redirect('/api/signin?error=User already exists. Please sign in.');// Respond with a 400 status and an error alert and redirect to signin page
//     }

//     // Add new user and save
//     const newUser  = { username, email, password }; // Create a new user object with the provided data
//     users.push(newUser ); // Add the new user to the users array

//     // Write the updated users array back to users.json
//     fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => { // Asynchronously write the updated users array to the file
//       if (err) return next(err); // If there's an error writing the file, pass the error to the next middleware
//       res.status(302).redirect('/api/signin');//  Redirect to `/api/signin` after successful sign-up
//     });
//   });
// });

// // Sign-In Route (Verifies Credentials)
// router.post('/signin', (req, res, next) => { // Defining a POST route for user sign-in
//   const { email, password } = req.body; // Destructuring the request body to get email and password

//   // Read existing user data from users.json
//   fs.readFile(usersFilePath, 'utf-8', (err, data) => { // Asynchronously read the users.json file
//     if (err) return next(err); // If there's an error reading the file, pass the error to the next middleware

//     const users = JSON.parse(data); // Parse the JSON data into a JavaScript object
//     // Check if the user exists with the provided email and password
//     const user = users.find(u => u.email === email && u.password === password); // Search for a user with matching email and password

//     if (user) { // If a matching user is found
//       res.status(302).redirect('/api/home');//  Redirect to `/home` after successful sign-in
//     } else { // If no matching user is found
//       return res.status(401).redirect('/api/signin?error=Invalid email or password.'); // Respond with a 401 Unauthorized status and an error message
//     }
//   });
// });

// module.exports = router; // Exporting the router to be used in other parts of the application