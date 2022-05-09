const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');

const indexRouter = require('./router.js');
require('./dbConfig');

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use('/api', indexRouter);

// Gestione degli errori
app.use((err, req, res, next) => { // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({message: err.message});
});

app.listen(3000, () => console.log('Il server è attivo sulla porta 3000'));


passport.use(new GoogleStrategy(
    {
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: 'http://5.83.124.101:3000/oauth2/redirect/google'
    },
    function(issuer, profile, cb) {
        console.log("Issuer is: ", issuer);
        console.log("Profile is: ", profile);
        console.log("Callback is: ", cb);
    }
));

app.get('/login/google', passport.authenticate('google', {
    scope: [ 'email' ]
  }));