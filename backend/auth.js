var configConn= require('./config.json');
var passport = require('passport');
var socket=require('./wsServer.js');
const config = require('./config');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//Google auth
passport.use(
  new GoogleStrategy(configConn.google,
   function(request, accessToken, refreshToken, profile, done){
    var host= {
      nome:profile._json.displayName,
      email:profile._json.email,
      id_social:profile._json.sub
    }
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
         return done(null,profile)

      
   }
  )
);

//Facebook Auth
passport.use(new FacebookStrategy(configConn.facebook,
function(request, accessToken, refreshToken, profile, done){
  return done(null, profile)
}
));

passport.serializeUser(function(user,done){
  
    done(null,user);
});

passport.deserializeUser(function(user,done){
  done(null,user);
});