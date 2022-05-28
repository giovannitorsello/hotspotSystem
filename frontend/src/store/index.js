import { createStore } from "vuex";

export default createStore({
  state: {
    socialProfile: {},
    generatedTicket: {},
  },
  getters: {},
  mutations: {
    setSocialProfile: (state, profile) => {
      state.socialProfile = profile;
    },
    setGeneratedTicket: (state, ticket) => {
      state.generatedTicket = ticket;
    },
  },
  actions: {},
  modules: {},
});
