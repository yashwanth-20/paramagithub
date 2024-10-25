/*require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const session = require('express-session');

// Session configuration
app.use(session({
    secret: 'guruyash',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    cb(null, id);
});

// Passport GitHub strategy
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:2000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }
));

// Middleware for authentication checking
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Serve the React app (frontend)
//app.use(express.static(path.join(__dirname, 'Frontend Project', 'dist','index.html')));

// Routes for React app pages
app.get('/', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
      return res.sendFile(path.join(__dirname, 'dashboard.html')); // Redirect to dashboard if already authenticated
  }
  res.redirect('/auth/github'); // Redirect directly to GitHub login if not authenticated
});


// GitHub Authentication
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.sendFile(path.join(__dirname, 'dashboard.html')); // Redirect to dashboard after successful login
    }
);

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle error if logout fails
        }
        req.session.destroy((err) => { // Destroy session
            if (err) {
                return next(err);
            }
            res.redirect('/login'); // Redirect to login page after session is cleared
        });
    });
});

// Catch-all route to serve React app for non-API routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'Frontend Project', 'dist', 'index.html'));
// });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});*/




require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const session = require('express-session');

// Session configuration
app.use(session({
    secret: 'guruyash',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    cb(null, id);
});

// Passport GitHub strategy
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:5000/auth/github/callback" // Updated to use the correct port
    },
    function(accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }
));

// Middleware for authentication checking
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes for login, dashboard, and logout
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// GitHub Authentication
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard'); // Redirect to dashboard after successful login
    }
);

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => { // Destroy session completely
            if (err) {
                return next(err);
            }
            res.redirect('/login'); // Redirect to login page after session is cleared
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});