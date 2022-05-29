const config = require("./config.js").load();
const axios = require("axios");

exports.google = (req, res) => {
  const websocketServer = req.app.get("websocketServer");
  const userProfile = {
    socialId: req.user.id,
    socialProvider: req.user.provider,
    email: req.user._json.email,
    locale: req.user._json.locale,
    firstname: req.user.name.givenName,
    lastname: req.user.name.familyName,
  };
  generateTicket(userProfile)
    .then((ticket) => {
      if (req.session.websocketClientId) {
        websocketServer.sendMessage(req.session.websocketClientId, { state: "ok", type: "ticketGenerated", userProfile: userProfile, userTicket: ticket });
        res.redirect(config.passport.successRedirect);
      }
    })
    .catch((error) => console.log(error));
};

exports.facebook = (req, res) => {
  const websocketServer = req.app.get("websocketServer");
  const userProfile = {
    socialId: req.user.id,
    socialProvider: req.user.provider,
    email: req.user._json.email,
    locale: req.user._json.locale,
    firstname: req.user.name.givenName,
    lastname: req.user.name.familyName,
  };
  generateTicket(userProfile)
    .then((ticket) => {
      if (req.session.websocketClientId) {
        websocketServer.sendMessage(req.session.websocketClientId, { state: "ok", type: "ticketGenerated", userProfile: userProfile, userTicket: ticket });
        res.redirect(config.passport.successRedirect);
      }
    })
    .catch((error) => console.log(error));
};

exports.twitter = (req, res) => {
  const websocketServer = req.app.get("websocketServer");
  const userProfile = {
    socialId: req.user.id,
    socialProvider: req.user.provider,
    email: req.user._json.email,
    locale: req.user._json.locale,
    firstname: req.user.name.givenName,
    lastname: req.user.name.familyName,
  };
  generateTicket(userProfile)
    .then((ticket) => {
      if (req.session.websocketClientId) {
        websocketServer.sendMessage(req.session.websocketClientId, { state: "ok", type: "ticketGenerated", userProfile: userProfile, userTicket: ticket });
        res.redirect(config.passport.successRedirect);
      }
    })
    .catch((error) => console.log(error));
};

exports.github = (req, res) => {
  const websocketServer = req.app.get("websocketServer");
  const userProfile = {
    socialId: req.user.id,
    socialProvider: req.user.provider,
    email: req.user._json.email,
    locale: req.user._json.locale,
    firstname: req.user.name.givenName,
    lastname: req.user.name.familyName,
  };
  generateTicket(userProfile)
    .then((ticket) => {
      if (req.session.websocketClientId) {
        websocketServer.sendMessage(req.session.websocketClientId, { state: "ok", type: "ticketGenerated", userProfile: userProfile, userTicket: ticket });
        res.redirect(config.passport.successRedirect);
      }
    })
    .catch((error) => console.log(error));
};

function generateTicket(userProfile) {
  return new Promise(function (resolve, reject) {
    let url = config.ticket_server.url;
    var urlObj = new URL(url);
    var params = {
      action: config.ticket_server.action,
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      phone: userProfile.socialProvider + "--" + userProfile.socialId,
      email: userProfile.email,
      days: config.ticket_server.days,
      pin: config.ticket_server.pin,
    };
    urlObj.search = new URLSearchParams(params).toString();
    axios(url + urlObj.search)
      .then((result) => {
        console.log("Il ticket server risponde: ", result.data);
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
