const express = require("express"); // Express app
const router = express.Router(); // Router logic
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// This is where we import the controllers we will route
const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    // console.log('In Middleware');
    const authHeader = req.headers['authorization'];

    // Check if authorization header is present
    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    let headers = authHeader.split(' ');

    // Ensure there are enough tokens in the Auth Header
    if (headers.length < 2) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = headers[1];  // Get token from header

    // Check if token is null
    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json('Token Validation Error!');
        }
        req.auth = verified; // Set the auth param to the decoded object
        next();  // Continue the request flow
    });
}


// define route for our trips endpoint
router
    .route("/trips")
    .get(tripsController.tripsList) // GET Method routes tripList
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST Method Adds A Trip

// GET Method routes tripsFindByCode - requires parameter
router
    .route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip);

// define route for login endpoint
router
    .route('/login')
    .post(authController.login);

// define route for register endpoint
router
    .route('/register')
    .post(authController.register);

module.exports = router;