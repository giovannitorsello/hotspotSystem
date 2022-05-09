<template>
  <!--Template require only one root div element.-->
  <div id="social_login">
    <div id="login_choose" v-if="step == 0">
      <div class="row mr-0">
        <div class="col-md-6">
          <a class="btn btn-outline-dark" @click="getGoogleAuth()">
            <img style="width: 20px !important" alt="Google sign-in" src="../assets/google.svg" />
            Login with Google
          </a>
        </div>
      </div>

      <div class="row mr-0">
        <div class="col-md-6">
          <a class="btn btn-outline-dark" @click="getFacebookAuth()" role="button" style="text-transform: none">
            <img style="width: 20px !important" alt="Facebook sign-in" src="../assets/facebook.svg" />
            Login with Facebook
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
      };
    },
    methods: {
      getGoogleAuth() {
        console.log("Try google auth...");
        this.socialUrl = "http://localhost:3000/authenticate/google";
        this.step = 1;
      },
      getFacebookAuth() {
        console.log("Try facebook auth...");
        this.socialUrl = "http://localhost:3000/authenticate/facebook";
        this.step = 1;
      },
    },
  };

  /* sample use axios with localhost:3000 api
  /*this.axios
          .get("/api/read") -> this point to http://localhost:3000/api/read see .env file for base URL axios in View project
          .then((result) => {
            console.log("After Facebook", result);
          })
          .catch((err) => {
            console.log("Facebook error", err);
          });*/
</script>
