import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import PouchService from "./plugin/pouchdb";
import RequestService from "./plugin/request";

Vue.use(PouchService);
Vue.use(RequestService);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
