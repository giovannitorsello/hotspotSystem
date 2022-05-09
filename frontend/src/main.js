import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/style.css";
import axios from "axios";

//See .env file for backend base URL
var axiosApi = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

var app = createApp(App);

app.config.globalProperties.axios = axiosApi;

app.use(store);
app.use(router);
app.mount("#app");
