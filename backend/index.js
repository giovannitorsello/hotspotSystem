var config = require("./config.js").load();
const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");

const router = require("./router.js");
const database = require("./dbConfig.js");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "SECRET" })); // session secret

////////////////// CORS SECTION /////////////////////////
var allowedOrigins = ["http://localhost:3000", "http://localhost:8080, http://hostspotserver.wifinetcom.net:3000"];
app.use(cors(allowedOrigins));

////////////////// PASSPORT SECTON WILL BE MOVED IN OTHER FILE /////////////
passport.use(
  new GoogleStrategy(
    {
      clientID: "hotspotsystem",
      clientSecret: "AIzaSyA5yU2-b_jCX5BdAWcjX2uGSyH9QeUbW6I",
      callbackURL: "https://5.83.124.101:3000/oauth2/redirect/google",
    },
    function (issuer, profile, cb) {
      console.log("Issuer is: ", issuer);
      console.log("Profile is: ", profile);
      console.log("Callback is: ", cb);
    }
  )
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
////////////////// PASSPORT SECTON WILL BE MOVED IN OTHER FILE /////////////

app.use("/api", router);

// Gestione degli errori
/*app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({ message: err.message });
});*/

app.listen(3000, () => console.log("Il server è attivo sulla porta 3000"));

app.get("/authenticate/google", passport.authenticate("google", { scope: ["email"] }), (req, res) => {
  console.log(req);
  res.send(req.user);
});
