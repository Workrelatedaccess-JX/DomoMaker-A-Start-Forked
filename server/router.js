const controllers = require('./controllers');

const router = (app) => {
    // Login routes, Get on open login page, Post on submission to login form
    app.get('/login', controllers.Account.loginPage);
    app.post('/login', controllers.Account.login);

    // Signup routes, Get on open signup page, Post on submission to signup form
    app.get('/signup', controllers.Account.signupPage);
    app.post('/signup', controllers.Account.signup);

    // Logout route, get on logout route, redirect to login page for now
    app.get('/logout', controllers.Account.logout);

    // Maker route, Get on open maker page from successful login or signup
    app.get('/maker', controllers.Domo.makerPage);
    app.post('/maker', controllers.Domo.makeDomo);

    // Show main page
    app.get('/', controllers.Account.loginPage);
};

module.exports = router;