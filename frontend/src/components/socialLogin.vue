<template>
  <div id="social_login">
    <div id="login_choose" v-if="step == 0">
      <div class="row mr-0">
        <div class="col-md-6">
          <a @click="authGoogle()" class="btn btn-outline-dark">
            <img style="width: 20px !important" alt="Google sign-in" src="../assets/google.svg" />
            Accedi con Google
          </a>
        </div>
      </div>

      <div class="row mr-0">
        <div class="col-md-6">
          <a @click="authFacebook()" class="btn btn-outline-dark" role="button" style="text-transform: none">
            <img style="width: 20px !important" alt="Facebook sign-in" src="../assets/facebook.svg" />
            Accedi con Facebook
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        step: 0,
        socialUrl: "",
        websocketClientId: 0,
        connection: null,
        authLink: "",
        authWindow: {},
      };
    },
    created: function () {
      this.connectToWebSocket();
    },
    methods: {
      initLinks() {
        //this.urlAuthGoogle = "http://hotspottordev.wfn.ovh:3000/google/auth?websocketClientId=" + this.websocketClientId;
        //this.urlAuthFacebook = "http://hotspottordev.wfn.ovh:3000/facebook/auth?websocketClientId=" + this.websocketClientId;
        //this.urlAuthGoogle = "https://hotspottordev.wfn.ovh/auth/google?websocketClientId=" + this.websocketClientId;
        //this.urlAuthFacebook = "https://hotspottordev.wfn.ovh/auth/facebook?websocketClientId=" + this.websocketClientId;
      },
      authGoogle() {
        this.authLink = "http://hotspottordev.wfn.ovh:3000/google/auth?websocketClientId=" + this.websocketClientId;
        this.authWindow = window.open(this.authLink, "AuthWindow");
      },
      authFacebook() {
        this.authLink = "http://hotspottordev.wfn.ovh:3000/facebook/auth?websocketClientId=" + this.websocketClientId;
        this.authWindow = window.open(this.authLink, "AuthWindow");
      },
      openRBSession(username, password) {
        let authLoginRB = "http:/10.0.0.1/login";
        fetch(authLoginRB, {
          username: username,
          password: password,
          popup: "true",
          dst: "https://www.wifinetcom.net",
        })
          .then((result) => {
            console.log("Rb session created", result);
            window.open("https://www.wifinetcom.net");
          })
          .catch((error) => console.log("Error on Rb create session.", error));
      },
      connectToWebSocket() {
        //hotspotwfndev.wfn.ovh
        //hotspottordev.wfn.ovh
        var vueComponent = this;
        this.connection = new WebSocket("wss://hotspottordev.wfn.ovh:2021");

        this.connection.onmessage = function (event) {
          console.log("Message received from server");

          //Recover object sent by websocket server
          // Set client id received from server

          let obj = JSON.parse(event.data);
          console.log(event);
          console.log("Object sent is: ", obj);
          if (obj.action === "connect" && obj.clientId) {
            vueComponent.websocketClientId = obj.clientId;
            vueComponent.initLinks();
            console.log("ClientId assigned from server is: ", vueComponent.websocketClientId);
          }

          if (obj.state && obj.state === "ok" && obj.type && obj.type == "ticketGenerated" && obj.userProfile && obj.userTicket) {
            console.log("User authenticated and ticket produced");
            console.log("User profile:", obj.userProfile);
            console.log("User ticket:", obj.userTicket);
            if (vueComponent.authWindow) vueComponent.authWindow.close();
            alert("Social login success.");
            vueComponent.openRBSession(obj.userTicket.user, obj.userTicket.password);
          }
        };

        //This function intercept message sent by server
        this.connection.onopen = function (event) {
          console.log(event);
          console.log("Successfully connected to the echo websocket server...");
        };
      },
    },
  };
</script>
