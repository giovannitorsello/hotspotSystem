var config = require("./config.js").load();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("./authController.js");

module.exports = {
  configureRouter(app, session) {
    // Setting up the passport middleware for each of the OAuth providers
    const twitterAuth = passport.authenticate("twitter");
    const googleAuth = passport.authenticate("google", { scope: ["email", "profile"], session: false });
    const facebookAuth = passport.authenticate("facebook");
    const githubAuth = passport.authenticate("github");

    // This custom middleware allows us to attach the socket id to the session.
    // With the socket id attached we can send back the right user info to
    // the right socket
    const addSocketIdtoSession = (req, res, next) => {
      req.session.websocketClientId = req.query.websocketClientId;
      next();
    };

    // Routes that are triggered by the React client
    router.get("/google/auth", addSocketIdtoSession, googleAuth);
    router.get("/facebook/auth", addSocketIdtoSession, facebookAuth);
    router.get("/twitter/auth", addSocketIdtoSession, twitterAuth);
    router.get("/github/auth", addSocketIdtoSession, githubAuth);

    // Routes that are triggered by callbacks from OAuth providers once
    // the user has authenticated successfully
    router.get("/google/callback", googleAuth, authController.google);
    router.get("/facebook/callback", facebookAuth, authController.facebook);
    router.get("/twitter/callback", twitterAuth, authController.twitter);
    router.get("/github/callback", githubAuth, authController.github);
    return router;
  },
};
