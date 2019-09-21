/**
 * Entry point to the application
 */

// Require all dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');

// Set up mongoose connection to database and collections
let mongoose = require('./models/database');

// Store sessions in mongoDB
var MongoStore = require('connect-mongo')(session);

// Load route definitions
var routes = require('./routes/routes');

// Create the application
var app = express();

// Set up persistent login session middleware
app.use(session({
    secret: '4ybTX4zGXSSftxaJ',
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// To access session inside pug
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve icon for application
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// Module for parsing cookies
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(logger("dev"));


app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
