/* eslint-disable */
import Vue from "vue";

const FbAuth = "https://identitytoolkit.googleapis.com/v1";
const FbApiKey = "AIzaSyDzPVoywvIoFgd0e3Ze6v3JoOiq_RDTI0M";

const admin = {
  namespaced: true,
  state: {
    token: null,
    refresh: null
  },
  getters: {},
  mutations: {
    authUser(state, authData) {
      state.token = authData.idToken;
      state.refresh = authData.refreshToken;
    }
  },
  actions: {
    signin({ commit }, payload) {
      Vue.http
        .post(`${FbAuth}/accounts:signInWithPassword?key=${FbApiKey}`, {
          ...payload,
          returnSecureToken: true
        })
        .then(response => response.json())
        .then(authData => {
          commit("authUser", {
            ...authData,
            type: "signin"
          });
          localStorage.setItem("token", authData.idToken);
          localStorage.setItem("refresh", authData.refreshToken);
        });
    }
  }
};

export default admin;
