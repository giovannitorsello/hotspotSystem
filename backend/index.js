var config = require("./config.js").load();
var FormData = require("form-data");
var fs = require("fs");
var http = require("http");
var https = require("https");
var fetch = require("fetch-node");
var socketio = require("socket.io");
const session = require("express-session");
const createError = require("http-errors");
const express = require("express");
const process = require("process");
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
//const auth = require("./auth.js");

const passportInit = require("./passportInit.js");
const authRouter = require("./authRouter.js");
const authController = require("./authController.js");

/////////////////// SERVER SECTION /////////////////////
var certificate = fs.readFileSync(process.cwd() + config.server.certificateSSL, "utf8");
var privateKey = fs.readFileSync(process.cwd() + config.server.privateKeySSL, "utf8");
var credentials = { key: privateKey, cert: certificate };
const app = express();
// Start webSocket
wsServer.startServer(app);
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
//auth.setWebSocketServer(wsServer);
httpServer.listen(config.server.restPort, () => console.log("REST is on " + config.server.restPort));
httpsServer.listen(config.server.restSSLPort, () => console.log("SSL REST is on " + config.server.restSSLPort));
app.use(
  session({
    secret: config.server.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/", authRouter);
app.use(express.json());
app.use(passport.initialize());
passportInit();
app.set("ioHttp", socketio(httpServer));
app.set("ioHttps", socketio(httpsServer));
//app.set("ioWebSocket", socketio(wsServer));

/////////////////// SERVER SECTION /////////////////////

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
var allowedOrigins = [
  "*",
  "https://accounts.google.com/o/oauth2/v2/auth",
  "http://localhost:3000/",
  "http://localhost:3000/auth/google",
  "http://localhost:8080/",
  "https://hotspottordev.wfn.ovh",
  "https://hotspotwfndev.wfn.ovh",
  "https://accounts.google.com",
];
app.use(cors(allowedOrigins));
app.options("/", cors({ origin: allowedOrigins }));

// Setting up the passport middleware for each of the OAuth providers
const twitterAuth = passport.authenticate("twitter");
const googleAuth = passport.authenticate("google", { scope: ["email", "profile"] });
const facebookAuth = passport.authenticate("facebook");
const githubAuth = passport.authenticate("github");

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

// Routes that are triggered by the client
router.get("/twitter", addSocketIdtoSession, twitterAuth);
router.get("/google", addSocketIdtoSession, googleAuth);
router.get("/facebook", addSocketIdtoSession, facebookAuth);
router.get("/github", addSocketIdtoSession, githubAuth);

router.get("/twitter/callback", twitterAuth, authController.twitter);
router.get("/google/callback", googleAuth, authController.google);
router.get("/facebook/callback", facebookAuth, authController.facebook);
router.get("/github/callback", githubAuth, authController.github);

// ---------------- ROUTES ---------------------

app.use("/api", router);
app.use("/auth/google", function (req, res, next) {
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
