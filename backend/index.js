var config = require("./config.js").load();
var FormData = require("form-data");
var fs = require("fs");
var http = require("http");
var https = require("https");
const cors = require("cors");
const process = require("process");
const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// SPECIFIC PROJECT INCLUDES //
const wsServer = require("./wsServer.js");

// PASSPORT SPECIFIC REQUIREMENTS ////
const passportInit = require("./passportInit.js");
const authRouter = require("./authRouter.js");

/////////////////// SERVER SECTION /////////////////////
var certificate = fs.readFileSync(process.cwd() + config.server.certificateSSL, "utf8");
var privateKey = fs.readFileSync(process.cwd() + config.server.privateKeySSL, "utf8");
var credentials = { key: privateKey, cert: certificate };
const app = express();
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(config.server.restPort, () => console.log("REST is on " + config.server.restPort));
httpsServer.listen(config.server.restSSLPort, () => console.log("SSL REST is on " + config.server.restSSLPort));
wsServer.startServer(app);

app.set("websocketServer", wsServer);
/////////////////// SERVER SECTION /////////////////////

// CORS SECTION //
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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// CORS SECTION //
let session = expressSession({ secret: config.server.sessionSecret, resave: false, saveUninitialized: false });
app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

passportInit.init(app, session);
app.use("/", authRouter.configureRouter(app, session));
