const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // Login routes, Get on open login page, Post on submission to login form
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    // Signup routes, Get on open signup page, Post on submission to signup form
    app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    // Logout route, get on logout route, redirect to login page for now
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    // Maker route, Get on open maker page from successful login or signup
    app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

    // Show main page
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;