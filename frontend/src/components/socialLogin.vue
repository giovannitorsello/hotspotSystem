<template>
  <div id="social_login">
    <div id="login_choose" v-if="step == 0">
      <div class="row mr-0">
        <div class="col-md-6">
          <a class="btn btn-outline-dark">
            <img
              style="width: 20px !important"
              alt="Google sign-in"
              src="../assets/google.svg"
            />
            Accedi con Google
          </a>
        </div>
      </div>

      <div class="row mr-0">
        <div class="col-md-6">
          <a
            class="btn btn-outline-dark"
            role="button"
            style="text-transform: none"
          >
            <img
              style="width: 20px !important"
              alt="Facebook sign-in"
              src="../assets/facebook.svg"
            />
            Accedi con Facebook
          </a>
        </div>
      </div>
    </div>

    <div id="authentication_form" v-if="step == 1">
      <iframe height="400" width="600" :src="socialUrl"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 0,
      socialUrl: "",
      websocketCliendId: 0,
      connection: null,
    };
  },
  created: function () {
    this.connectToWebSocket();
  },
  methods: {
    openRBSession(username, password) {
      let authLoginRB="http:/10.0.0.1/login";
      axios.(authLoginRB, {
        username: username,
        password: password,
        popup: "true",
        dst: "https://www.wifinetcom.net"
      })
    },
    getGoogleAuth() {
      console.log("Try google auth...");
      this.socialUrl = "http://localhost:3000/auth/google";
      this.step = 1;

      axios.get(this.socialUrl, {
        params: {
        websocketCliendId: this.websocketCliendId,
        }
      });
    },
    getFacebookAuth() {
      console.log("Try facebook auth...");
      this.socialUrl = "http://localhost:3000/auth/facebook";
      this.step = 1;
      axios.get(this.socialUrl, {
        params: {
        websocketCliendId: this.websocketCliendId,
        }
      });
    },
    connectToWebSocket() {
      this.connection = new WebSocket("wss://hotspotwfndev.wfn.ovh:2021");

      this.connection.onmessage = function (event) {
        console.log("Message received from server");

        //Recover object sent by websocket server
        // Set client id received from server

        let obj = JSON.parse(event.data);
        console.log(event);
        console.log("Object sent is: ", obj);
        if (obj.action === "connect" && obj.clientId) {
          this.websocketCliendId = obj.clientId;
          console.log("ClientId assigned from server is: ", this.websocketCliendId);
        }

        if(obj.action=="ticketGenerated" && obj.clientId) {
          openRBSession(obj.data.username, obj.data.password);
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
