var configConn = require("./config.json");
var passport = require("passport");
var socket = require("./wsServer.js");
const config = require("./config");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

var webSocketServer = null;

//Google auth
/*
passport.use(
  new GoogleStrategy(configConn.google, function (request, accessToken, refreshToken, profile, done) {
    var host = {
      nome: profile._json.displayName,
      email: profile._json.email,
      id_social: profile._json.sub,
    };
    console.log(profile);
    console.log(host);

    //Informazioni in ingresso
    //websocket
    //clientid

    // generare il ticket chiamando con axios
    //il sistema esistente per la generazione
    // al posto del numero di telefono
    // google-idgoogle o facebook-idfacebook

    // nella callback di axios si deve inserire il messaggio
    // websocket "generatedTicket" da inviare al client con
    // le credenziali del ticket generato. I dati devono essere merri
    // nel campo ticket della risposta
    return done(null, profile);
  })
);*/

//Facebook Auth
/*passport.use(
  new FacebookStrategy(configConn.facebook, function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = {
  setWebSocketServer(ws) {
    this.webSocketServer = ws;
  },
  google(req, res) {
    const io = req.app.get("io");
    let firstname = req.user.displayName;
    let lastname = req.user.displayName;
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
    const user = {
      name: req.user.displayName,
      photo: req.user.photos[0].value.replace(/sz=50/gi, "sz=250"),
    };
    io.in(req.session.socketId).emit("google", user);
  },
  facebook(req, res) {},
  twitter(req, res) {},
  github(req, res) {},
};
*/
