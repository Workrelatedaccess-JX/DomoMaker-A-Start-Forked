// Reminder: the controllers are responsible for handling the logic of the routes(incoming requests) and sending back the appropriate responses, 
// and they interact with the models to perform database operations.
// Account.js in controller handle the logic for the account routes, including login, signup, and logout functionality.
// Here, Import Account.js model from the models directory. That Account.js interact with the database.
const models = require('../models');
const Account = models.Account;

// These three functions are responsible for rendering the login and signup pages, and handling the logout functionality
const loginPage = (req, res) => res.render('login');
const signupPage = (req, res) => res.render('signup');
const logout = (req, res) => res.redirect('/');

// SignUp function, async is used because the need to wait for the database to save the account
const signup = async (req, res) => {
    // GET username, pass, and pass2 from the request body by wrapping them in backticks and ${} to force them to be strings
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    // 1st validation: blank fields, send 400 error (Bad Request) with a JSON message
    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // 2nd validation: Make sure they typed the same password twice.
    // IF pass is =/= to pass2, send a 400 error (Bad Request) with a JSON message.
    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    // Try to save the account. If anything breaks, catch the error.
    try {
        // Hash the password using the static function in the model.
        // await pauses the function until bcrypt finishes scrambling the password.
        const hash = await Account.generateHash(pass);

        // Create a new Account with the username and hashed password.
        const newAccount = new Account({ username, password: hash });

        // Save the new account to the mongo database.
        await newAccount.save();

        // Redirect the user to the /maker page.
        return res.json({ redirect: '/maker' });

    } catch (err) {
        // MongoDB error catch.
        console.log(err);

        // Error code 11000, tried to save a duplicate value.
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }

        // If it's some other database error, send a generic 500 server error.
        return res.status(500).json({ error: 'An error occurred!' });
    }
};

// Login function
const login = (req, res) => {
    // Grab the data from the login form request body 
    // and use backticks and ${} to force them to be strings as usual
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    // same validate: Make sure fields aren't blank.
    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // Ask the Model to authenticate the user. Pass a callback function as the 3rd argument.
    // The Model will check the database and call the callback when it's done.
    return Account.authenticate(username, pass, (err, account) => {
        
        // If there is an error, or if no account was found like wrong username/password,
        // send a 401 Unauthorized error
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }

        // If reach here, authentication was successful, redirect to the main page.
        return res.json({ redirect: '/maker' });
    });
};

// Export all these functions so router.js can use them.
module.exports = {
    loginPage,
    signupPage,
    login,
    logout,
    signup,
};