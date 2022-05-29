import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/loginView.vue";
import authenticatedView from "../views/authenticatedView.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/authenticated",
    name: "Welcolme",
    component: authenticatedView,
  },
];

const router = createRouter({ history: createWebHashHistory(), routes });

export default router;
