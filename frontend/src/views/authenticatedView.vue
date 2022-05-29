<template>
  <div id="authenticated">
    <div id="Welcolme">
      <div class="row mr-0">
        <div class="col-md-6">
          <p>Welcolme</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        profile: {},
        ticket: {},
      };
    },
    created: function () {},
    methods: {
      /*openRBSession(username, password) {
        let authLoginRB = "http:/10.0.0.1/login";
        fetch(authLoginRB, {
          username: username,
          password: password,
          popup: "true",
          dst: "https://www.wifinetcom.net",
        });
      },*/
    },
  };
</script>
