const express = require("express");
const router = express.Router();
const db = require("./dbConfig");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { log } = require("console");

//////////////// Begin routes ///////////////////
router.post("/register", (req, res, next) => {
  if (req.body.firstName.length == 0 || req.body.lastName.length == 0 || req.body.email.length == 0 || req.body.phone.length == 0) {
    res.send({ msg: "Contrallare i campi" });
  } else {
    db.query("SELECT * FROM users WHERE email ='" + req.body.email + "';", (err, result) => {
      if (result.length > 0) {
        res.send({ msg: "Utente già inserito" });
      } else {
        db.query("INSERT INTO users (firstName, lastName, email, phone) VALUES ('" + req.body.firstName + "','" + req.body.lastName + "','" + req.body.email + "','" + req.body.phone + "')", result);

        var url =
          "http://wifiticket.wifinetcom.net:8080/WIFITicketSystem2/TicketServlet?action=get_ticket_sms&pin=03904800756090620171251&nome=" +
          req.body.firstName +
          "&cognome=" +
          req.body.lastName +
          "&phone=" +
          req.body.phone +
          "&email=" +
          req.body.email +
          "&days=7";
        axios
          .post(url)
          .then((result) => {
            console.log("Il ticket server risponde: ", result);
            res.send({ msg: "Utente Inserito con successo a breve ricevereai il messaggio con i codici di accesso" });
          })
          .catch((error) => {
            console.log("Errore, ticket server non raggiungibile");
          });
      }
    });
  }
});

router.post("/login", (req, res, next) => {});

router.get("/login/google", (req, res, next) => {
  passport.authenticate("google");
});

router.post("/get-user", (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(" ")[1]) {
    return res.status(422).json({ message: "Please provide the token" });
  }
  const theToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(theToken, "the-super-strong-secrect");
  db.query("SELECT * FROM users where id=?", decoded.id, function (error, results, fields) {
    if (error) throw error;

    return res.send({ error: false, data: results[0], message: "Fetch Successfully." });
  });
});

router.get("/google/redirect", (req, res, next) => {
  res.send("This route will be called by google OAuth2");
});

module.exports = router;
