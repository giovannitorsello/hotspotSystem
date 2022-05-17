var config = require("./config.js").load();
const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const router = require("./router.js");
const database = require("./dbConfig.js");
const wsServer = require("./wsServer.js");

require("./auth");
const app = express();

function isLogged(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());

var allowedOrigins = ["http://localhost:3000", "http://localhost:8080, http://hostspotserver.wifinetcom.net:3000"];
app.use(cors(allowedOrigins));

app.use("/api", router);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("somenting go wrong");
});

app.get("/protected", isLogged, (req, res) => {
  res.send(`hello ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
  req.logOut();
  req.session.destroy();
  res.send("goodbye");
});

// Gestione degli errori
/*app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({ message: err.message });
});*/

app.listen(config.server.restPort, () => console.log("Il server è attivo sulla porta 3000"));

//start web soicket server
wsServer.startServer(app);
