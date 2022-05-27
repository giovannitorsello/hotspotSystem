<template>
  <div class="main-container">
    <div class="box-container">
      <h2 class="heading">Crea il tuo account</h2>
      <div class="form-fields">
        <input
          id="firstName"
          name="firstName"
          type="text"
          v-model="webSurfer.firstName"
          placeholder="Nome"
        />
        <input
          id="lastName"
          name="lastName"
          type="text"
          v-model="webSurfer.lastName"
          placeholder="Cognome"
        />
        <input
          id="email"
          name="email"
          type="text"
          v-model="webSurfer.email"
          placeholder="Email"
        />
        <input
          id="phone"
          name="phone"
          type="text"
          v-model="webSurfer.phone"
          placeholder="Telefono"
        />
      </div>

      <div class="form-fields">
        <button class="createaccount" name="commit" @click="registerDB()">
          Crea account
        </button>
      </div>
      <SocialSignUp />
      <div>
        <p class="center">
          Accetti i nostri termini e condizioni per il trattamento dei dati
          <a href="https://www.wifinetcom.net/wp-content/uploads/2022/03/informativa_privacy.pdf">Termini e condizioni</a>.
        </p>
      </div>
    </div>

    <div class="footer">
      <p>HAI GIA UN ACCOUNT? <a href="/"> Accedi</a></p>
    </div>
  </div>
</template>
<script>
import * as Vue from "vue";
import axios from "axios";
import App from "@/App.vue";
import VueAxios from "vue-axios";
const app = Vue.createApp(App);
app.use(VueAxios, axios);
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
import SocialSignUp from "../components/socialLogin.vue";
export default {
  name: "signupView",
  data() {
    return {
      webSurfer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        pin: "03904800756090620171251",
        days: 7,
      },
    };
  },
  components: {
    SocialSignUp,
  },

  methods: {
    registerDB() {
      let payload = {
        firstName: this.webSurfer.firstName,
        lastName: this.webSurfer.lastName,
        email: this.webSurfer.email,
        phone: this.webSurfer.phone,
      };
      axios
        .post("http://localhost:3000/api/register", payload)
        .then(function (response) {
          console.log(response.data);

          alert(response.data.msg);
        })
        .catch(function (error) {
          console.log(error);
          alert(error.response.data.msg);
        });
    },
  },
};
</script>
