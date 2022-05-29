var config = require("./config.js").load();
const passport = require("passport");

const { Strategy: TwitterStrategy } = require("passport-twitter");
const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { Strategy: GithubStrategy } = require("passport-github");

module.exports = {
  init(app, session) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, cb) => {
      cb(null, user);
    });
    passport.deserializeUser((user, cb) => {
      cb(null, user);
    });

    const callback = (request, accessToken, refreshToken, profile, done) => {
      console.log(profile);
      return done(null, profile);
    };

    passport.use(new GoogleStrategy(config.passport.google, callback));
    //passport.use(new TwitterStrategy(config.passport.twitter, callback));
    //passport.use(new FacebookStrategy(config.passport.facebook, callback));
    //passport.use(new GithubStrategy(config.passport.github, callback));
  },
};
