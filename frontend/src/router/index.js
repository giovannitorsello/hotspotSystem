import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/loginView.vue";
import AutheticatedView from "../views/loginView.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/authenticated",
    name: "Welcolme",
    component: AutheticatedView,
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });

export default router;
