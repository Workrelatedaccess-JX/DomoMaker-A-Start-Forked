// set up server, importing libraries and modules via require()

// Load Redis string from .env file into process.env, allowing the app to access environment variables defined in the .env file.
require('dotenv').config();

// import the path module for handling file paths
const path = require('path');

// creates and manages the server and routes
const express = require('express');

// compresses responses to reduce their size
const compression = require('compression');

// small icon
const favicon = require('serve-favicon');

// Connects Node.js to MongoDB and manages database data
const mongoose = require('mongoose');

// let server generate HTML pages dynamically using templates and data
const expressHandlebars = require('express-handlebars');

// adds security-related HTTP headers to protect the app from common web vulnerabilities
const helmet = require('helmet');

// manages user sessions, allowing the server to remember users across requests
const session = require('express-session');

// Import Redis libraries
const redis = require('redis');
const RedisStore = require('connect-redis').RedisStore;

// contain website routes and their corresponding controller functions
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Server try to connect to MongoDB before it can start listening for incoming requests. 
// If the connection fails, it will log an error message and throw the error, preventing the server from starting. 
// This ensures that the application does not run without a database connection.
// if MongoDB URL exist, use it, otherwise use local MongoDB URL
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';
mongoose.connect(dbURI).catch((err) => {
    if (err) {
        console.log('Could not connect to database');
        throw err;
    }
});

// Create Redis client
const redisClient = redis.createClient({
    url: process.env.REDISCLOUD_URL,
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

// Connect to Redis before starting Express
redisClient.connect().then(() => {

    // create the actual server instance using Express.js, which will handle incoming requests and send responses
    const app = express();

    // add middleware to the Express app for safety.
    // Middleware functions are executed in the order they are added to the app.
    app.use(helmet());

    // tell express server to serve static files like CSS, JavaScript, and images from the 'hosted' directory when requested by clients.
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));

    // tell express server to serve the tiny icon
    app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));

    // use compression to shrink the size of the response body/data sent to the client
    app.use(compression());

    // Two body parsing middleware take incoming request data and parse it into a format that can be easily accessed and used by the server.
    // If data is sent as a URL-encoded form or as a Json object, parse it and put it inside req.body for reading
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Configure sessions to use Redis
    app.use(session({
        key: 'sessionid',
        store: new RedisStore({
            client: redisClient,
        }),
        secret: 'Domo Arigato',
        resave: false,
        saveUninitialized: false,
    }));

    // view engine setup
    // tell express to use handlebars as a template to generate HTML pages.
    app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));

    // tell express that on res.render() call, look for the handlebars files
    app.set('view engine', 'handlebars');

    // tell express where to find the handlebars files
    app.set('views', `${__dirname}/../views`);

    // after all the above setup, pass express app to router function to set up the routes and their corresponding controller functions
    router(app);

    // start the server and listen for incoming requests on the specified port
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`Listening on port ${port}`);
    });

})
.catch((err) => {
    console.log('Could not connect to Redis');
    throw err;
});