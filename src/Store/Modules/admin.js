/* eslint-disable */
import Vue from "vue";
import router from "../../routes";

const FbAuth = "https://identitytoolkit.googleapis.com/v1";
const FbApiKey = "AIzaSyDzPVoywvIoFgd0e3Ze6v3JoOiq_RDTI0M";

const admin = {
  namespaced: true,
  state: {
    token: null,
    refresh: null,
    authFailed: false,
    refreshLoading: true,
    addpost: false,
    imageUpload: null,
    adminPosts: null
  },
  getters: {
    isAuth(state) {
      if (state.token) {
        return true;
      }
      return false;
    },
    refreshLoading(state) {
      return state.refreshLoading;
    },
    addPostStatus(state) {
      return state.addpost;
    },
    imageUpload(state) {
      return state.imageUpload;
    },
    getAdminPosts(state) {
      return state.adminPosts;
    }
  },
  mutations: {
    authUser(state, authData) {
      state.token = authData.idToken;
      state.refresh = authData.refreshToken;

      if (authData.type === "signin") {
        router.push("/dashboard");
      }
    },
    authFailed(state, type) {
      if (type === "reset") {
        state.authFailed = false;
      } else {
        state.authFailed = true;
      }
    },
    logoutUser(state) {
      state.token = null;
      state.refresh = null;

      localStorage.removeItem("teoken");
      localStorage.removeItem("refresh");

      router.push("/");
    },
    refreshLoading(state) {
      state.refreshLoading = false;
    },
    addPost(state) {
      state.addpost = true;
    },
    clearAddPost(state) {
      state.addpost = false;
    },
    imageUpload(state, imageData) {
      state.imageUpload = imageData.secure_url;
    },
    clearImageUpload(state) {
      state.imageUpload = null;
    },
    getAdminPosts(state, posts) {
      state.adminPosts = posts;
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
        })
        .catch(error => {
          commit("authFailed");
        });
    },
    refreshToken({ commit }) {
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        Vue.http
          .post(`https://securetoken.googleapis.com/v1/token?key=${FbApiKey}`, {
            grant_type: "refresh_token",
            refresh_token: refreshToken
          })
          .then(response => response.json())
          .then(authData => {
            commit("authUser", {
              idToken: authData.id_token,
              refreshToken: authData.refresh_token,
              type: "refresh"
            });

            commit("refreshLoading");

            localStorage.setItem("token", authData.id_token);
            localStorage.setItem("refresh", authData.refresh_token);
          });
      } else {
        commit("refreshLoading");
      }
    },
    addPost({ state, commit }, payload) {
      Vue.http
        .post(`posts.json?auth=${state.token}`, payload)
        .then(response => response.json())
        .then(response => {
          commit("addPost");
          setTimeout(() => {
            commit("clearAddPost");
          }, 3000);
        });
    },
    imageUpload({ commit }, file) {
      const CLOUDINARY_URL =
        "https://api.cloudinary.com/v1_1/dzlcrz8hp/image/upload";
      const CLOUDINARY_PRESET = "vi2qy9wh";

      let formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      Vue.http
        .post(CLOUDINARY_URL, formData, {
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
        .then(response => response.json())
        .then(response => {
          commit("imageUpload", response);
        });
    },
    getAdminPosts({ commit }, payload) {
      Vue.http
        .get(`posts.json?orderBy="$key"&limitToLast=${payload.limit}`)
        .then(response => response.json())
        .then(response => {
          const posts = [];
          for (let key in response) {
            posts.push({
              ...response[key],
              id: key
            });
          }
          commit("getAdminPosts", posts.reverse());
        });
    },
    deletePost({ commit, state }, payload) {
      Vue.http
        .delete(`posts/${payload}.json?auth=${state.token}`)
        .then(response => {
          let newPosts = [];
          state.adminPosts.forEach(post => {
            if (post.id != payload) {
              newPosts.push(post);
            }
          });
          commit("getAdminPosts", newPosts);
        });
    }
  }
};

export default admin;
