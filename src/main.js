import Vue from "vue";
import App from "./App.vue";
import VueResource from "vue-resource";
import router from "./routes";
import store from "./Store/store";
import vuelidate from "vuelidate";
import wysiwyg from "vue-wysiwyg";

import {
  MdCard,
  MdButton,
  MdDialog,
  MdContent,
  MdTable,
  MdDialogConfirm
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";

import Button from "./components/UI/button.vue";
Vue.component("app-button", Button);
Vue.use(MdCard);
Vue.use(MdButton);
Vue.use(MdDialog);
Vue.use(MdContent);
Vue.use(MdTable);
Vue.use(MdDialogConfirm);

Vue.use(VueResource);
Vue.http.options.root = "https://gamezone-bc553.firebaseio.com/";

Vue.use(vuelidate);
Vue.use(wysiwyg, {});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
