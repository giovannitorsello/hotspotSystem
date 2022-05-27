<template>
  <div id="social_login">
    <div id="login_choose" v-if="step == 0">
      <div class="row mr-0">
        <div class="col-md-6">
          <a :href="urlAuthGoogle" class="btn btn-outline-dark">
            <img style="width: 20px !important" alt="Google sign-in" src="../assets/google.svg" />
            Accedi con Google
          </a>
        </div>
      </div>

      <div class="row mr-0">
        <div class="col-md-6">
          <a :href="urlAuthFacebook" class="btn btn-outline-dark" role="button" style="text-transform: none">
            <img style="width: 20px !important" alt="Facebook sign-in" src="../assets/facebook.svg" />
            Accedi con Facebook
          </a>
        </div>
      </div>
    </div>

    <!--div id="authentication_form" v-if="step == 1">
      <iframe height="400" width="600" :src="socialUrl"></iframe>
    </div-->
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
        urlAuthGoogle: "",
        urlAuthFacebook: "",
      };
    },
    created: function () {
      this.connectToWebSocket();
    },
    methods: {
      initLinks() {
        this.urlAuthGoogle = "http://localhost:3000/auth/google?websocketClientId=" + this.websocketClientId;
        this.urlAuthFacebook = "http://localhost:3000/auth/facebook?websocketClientId=" + this.websocketClientId;
        //this.urlAuthGoogle = "https://hotspottordev.wfn.ovh/auth/google?websocketClientId=" + this.websocketClientId;
        //this.urlAuthFacebook = "https://hotspottordev.wfn.ovh/auth/facebook?websocketClientId=" + this.websocketClientId;
      },
      authGoogle() {
        let url = "http://localhost:3000/auth/google";
        fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ websocketClientId: this.websocketClientId }),
        })
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
      },
      authFacebook() {
        let url = "http://localhost:3000/auth/facebook";
        fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ websocketClientId: this.websocketClientId }),
        })
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
      },
      openRBSession(username, password) {
        let authLoginRB = "http:/10.0.0.1/login";
        fetch(authLoginRB, {
          username: username,
          password: password,
          popup: "true",
          dst: "https://www.wifinetcom.net",
        });
      },
      connectToWebSocket() {
        //hotspotwfndev.wfn.ovh
        //hotspottordev.wfn.ovh
        var vueComponent = this;
        this.connection = new WebSocket("wss://localhost:2021");

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

          if (obj.action == "ticketGenerated" && obj.clientId) {
            this.openRBSession(obj.data.username, obj.data.password);
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
