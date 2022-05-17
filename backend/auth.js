var configConn= require('./config.json');
var passport = require('passport');
const config = require('./config');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


passport.use(
  new GoogleStrategy(configConn.google,
   function(request, accessToken, refreshToken, profile, done){
     return done(null, profile)
   }
  )
);
passport.use(new FacebookStrategy(configConn.facebook,
function(request, accessToken, refreshToken, profile, done){
  return done(null, profile)
}
));


passport.serializeUser(function(user,done){
  done(null,user);
});
passport.deserializeUser(function(user,done){
  done(null,user);
});