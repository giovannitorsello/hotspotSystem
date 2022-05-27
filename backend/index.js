var config = require("./config.js").load();
var FormData = require("form-data");
var fs = require("fs");
var http = require("http");
var https = require("https");
var fetch = require("fetch-node");
const createError = require("http-errors");
const express = require("express");
const process = require("process");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const { URL, URLSearchParams } = require("url");
const cors = require("cors");
const passport = require("passport");
const router = require("./router.js");
const database = require("./dbConfig.js");
const wsServer = require("./wsServer.js");
const { profile } = require("console");
const { sendMessage } = require("./wsServer.js");
const auth = require("./auth.js");
var certificate = fs.readFileSync(process.cwd() + config.server.certificateSSL, "utf8");
var privateKey = fs.readFileSync(process.cwd() + config.server.privateKeySSL, "utf8");

var credentials = { key: privateKey, cert: certificate };

const app = express();
// Start webSocket
wsServer.startServer(app);
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
auth.setWebSocketServer(wsServer);
httpServer.listen(config.server.restPort, () => console.log("REST is on " + config.server.restPort));
httpsServer.listen(config.server.restSSLPort, () => console.log("SSL REST is on " + config.server.restSSLPort));

// middleware if user is authenticated
function isLogged(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());
var allowedOrigins = ["http://localhost:3000", "http://localhost:8080, https://hotspottordev.wfn.ovh", "https://hotspotwfndev.wfn.ovh", "https://accounts.google.com", "*"];
app.use(cors(allowedOrigins));

app.use("/api", router);
app.use("/auth/google", function (req, res, next) {
  req.session.cookie.data.websocketClientId = req.query.websocketClientId;
  console.log(req);
  next();
});
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get("/auth/facebook", function (req, res, next) {
  passport.authenticate(
    "facebook",
    {
      scope: ["email", "profile"],
      websocketCliendId: req.query.websocketCliendId,
    },
    function (req, res) {
      res.redirect("/~" + req.user.username);
    }
  );
});

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/facebook/callback", function (req, res, next) {
  passport.authenticate("facebook", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  });
});

app.get("/auth/failure", (req, res) => {
  res.send("somenting go wrong");
});

app.get("/protected", isLogged, (req, res) => {
  let firstname = "Giovanni";
  let lastname = "Torsello";
  let pin = "1111";
  let phone = "111111111"; //profile.provider+"-"+profile.id
  let email = "giovanni.torsello@gmail.com";
  var url = new URL("http://wifiticket.wifinetcom.net:8080/WIFITicketSystem2/TicketServlet");
  var params = {
    action: "get_ticket_email",
    nome: firstname,
    cognome: lastname,
    days: "7",
    pin: "1111",
    phone: phone,
    email: email,
  };
  res.send(params);
  url.search = new URLSearchParams(params).toString();
  /*fetch(url)
    .then((result) => {
      console.log("Il ticket server risponde: ", result);
      res.send({});
    })
    .catch((error) => {
      console.log("Errore, ticket server non raggiungibile");
    });*/
});

app.get("/logout", (req, res) => {
  req.logOut();
  req.session.destroy();
  res.send("goodbye");
});
