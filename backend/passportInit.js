var config = require("./config.js").load();
const passport = require("passport");
const { Strategy: TwitterStrategy } = require("passport-twitter");
const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { Strategy: GithubStrategy } = require("passport-github");

const cb = function (state, profile) {
  console.log(profile);
};

module.exports = () => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  const callback = (request, accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done();
  };

  passport.use(new GoogleStrategy(config.passport.google, callback));
  //passport.use(new TwitterStrategy(config.passport.twitter, callback));
  //passport.use(new FacebookStrategy(config.passport.facebook, callback));
  //passport.use(new GithubStrategy(config.passport.github, callback));
};
