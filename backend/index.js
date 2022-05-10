var config = require("./config.js").load();
const fs = require("fs");
const http = require("http");
const https = require("https");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const createError = require("http-errors");
const session = require("express-session");
const path = require("path");

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
var allowedOrigins = ["http://localhost:3000", "http://localhost:8080", "https://" + config.server.domain];
app.use(cors(allowedOrigins));

////////////////// PASSPORT SECTON WILL BE MOVED IN OTHER FILE /////////////
passport.use(
  new GoogleStrategy(config.passport.google, function (issuer, profile, cb) {
    console.log("Issuer is: ", issuer);
    console.log("Profile is: ", profile);
    console.log("Callback is: ", cb);
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
////////////////// PASSPORT SECTON WILL BE MOVED IN OTHER FILE /////////////

// Gestione degli errori
/*app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({ message: err.message });
});*/

//general api route
app.use("/api", router);

//Passport authentication route for google
app.get("/authenticate/google", passport.authenticate("google", { scope: ["email"] }));

//Passport authentication route for facebook
app.get("/authenticate/facebook", passport.authenticate("facebook", { scope: ["email"] }));

//Create server for listening
try {
  var httpServer = http.createServer(app);
  var credentials = {
    key: fs.readFileSync(process.cwd() + config.server.domain_key, "utf8"),
    cert: fs.readFileSync(process.cwd() + config.server.domain_cert, "utf8"),
  };
  var httpsServer = https.createServer(credentials, app);

  httpServer.listen(config.server.http_port);
  httpsServer.listen(config.server.https_port);

  console.log("Servers started", config.server);
} catch (error) {
  console.log("Error on starting servers", error);
}
