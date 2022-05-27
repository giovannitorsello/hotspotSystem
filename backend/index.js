var config = require("./config.js").load();
var FormData = require('form-data');
var fs = require('fs');
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
const {profile} = require("console");
const {sendMessage} = require("./wsServer.js");

require("./auth");
const app = express();

// middleware if user is authenticated
function isLogged(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "SECRET"}));
app.use(passport.initialize());
app.use(passport.session());
var allowedOrigins = ["http://localhost:3000", "http://localhost:8080, http://hostspotserver.wifinetcom.net:3000", "*"];
app.use(cors(allowedOrigins));

app.use("/api", router);

app.get("/auth/google", passport.authenticate("google", {
    scope: ["email", "profile"]
}));

app.get("/auth/facebook", passport.authenticate("facebook", {
    scope: ["email", "profile"]
}));

app.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure"
}));

app.get("/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure"
}));

app.get("/auth/failure", (req, res) => {
    res.send("somenting go wrong");
});

app.get("/protected", isLogged, (req, res) => {

    let firstname="";
    let lastname="";
    let pin="";
    let phone="";  //profile.provider+"-"+profile.id
    let email="";
    var url = "http://wifiticket.wifinetcom.net:8080/WIFITicketSystem2/TicketServlet?action=get_ticket_sms&pin=1111&nome=" + req.body.firstName + "&cognome=" + req.body.lastName + "&phone=" + req.body.phone + "&email=" + req.body.email + "&days=7";
    axios.get(url, {
        params: {
            nome: firtstname,
            cognome: lastname,
            pin: "1111",
            phone: phone,
            email: email
          }
    }).then((result) => {
        console.log("Il ticket server risponde: ", result);
        res.send({});
        
    }).catch((error) => {
        console.log("Errore, ticket server non raggiungibile");
    });
});

app.get("/logout", (req, res) => {
    req.logOut();
    req.session.destroy();
    res.send("goodbye");
});

app.listen(config.server.restPort, () => console.log("Il server è attivo sulla porta 3000"));

// Start webSocket
wsServer.startServer(app);
