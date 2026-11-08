// Check if the user is logged in, 
// if yes, call next() to continue to the next middleware or route handler, 
// otherwise redirect to the login page
const requiresLogin = (req, res, next) => {
    if (!req.session.account) {
        return res.redirect('/');
    }
    return next();
};

// Check if the user is logged out
// if yes, call next() to continue to the next middleware or route handler, 
// otherwise redirect to the maker page
const requiresLogout = (req, res, next) => {
    if (req.session.account) {
        return res.redirect('/maker');
    }
    return next();
};

// Check if the request uses HTTPS
// if yes, call next() to continue to the next middleware or route handler,
// otherwise redirect to the HTTPS version of the same URL
const requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
};

// Skip HTTPS checking during local development
const bypassSecure = (req, res, next) => {
    next();
};

// Export middleware functions
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Use HTTPS checking on production, but bypass it locally
if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}