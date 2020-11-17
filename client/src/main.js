import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import { sync } from "vuex-router-sync";

import vuetify from "./plugins/vuetify";
Vue.config.productionTip = false;

sync(store, router);

new Vue({
  el: "#app",
  router,
  store,
  vuetify,
  render: h => h(App)
});
