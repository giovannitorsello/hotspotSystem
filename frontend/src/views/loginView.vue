<template>
  <div class="main-container">
    <form>
      <div class="box-container">
        <h2 class="heading">HOTSPOT WIFI</h2>
        <div class="form-fields">
          <input
            id="email"
            name="email"
            type="text"
            v-model="users.email"
            placeholder="Email Address"
          />
        </div>
        <div class="form-fields">
          <input
            id="password"
            name="password"
            type="text"
            v-model="users.password"
            placeholder="Password"
          />
        </div>
        <div class="form-fields">
          <button class="signIn" name="commit" type="submit" @click="postData()">
            ACCEDI ORA
          </button>
        </div>
        <div class="login-choice"><span>O ACCEDI CON</span></div>
        <SocialLogin />
      </div>
    </form>
    <div class="footer">
      <p>NON HAI UN ACCOUNT? <router-link to="/register">Registrati</router-link></p>
    </div>
  </div>
</template>

<script>
import * as Vue from "vue";
import axios from "axios";
import App from '@/App.vue'
import VueAxios from "vue-axios";
const app = Vue.createApp(App);
app.use(VueAxios, axios);
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

import SocialLogin from "../components/socialLogin.vue";
export default {
  name: "loginView",
  components: {
    SocialLogin,
  },

  data() {
    return {
      users: {
        email: "",
        password: "",
        msg:'',
      },
    };
  },

  methods: {
   postData() {
      let payload = {
        email: this.users.email,
        password: this.users.password,
      };
      axios
        .post("http://localhost:3000/api/login", payload)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
