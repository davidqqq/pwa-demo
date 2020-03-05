<template>
  <div id="app" class="bg-gray-300">
    <div v-if="online">You are currently online</div>
    <div v-else>You are currently offline but dont worry you can still register account</div>
    <LoginView v-if="!login" />
    <div v-else>
      <!-- <div
        v-if="loading"
        class="absolute fixed w-full h-full top-0 left-0 flex items-center justify-center"
      >
        <div class="absolute w-full h-full bg-gray-900 opacity-50" />
        <div class="bg-white mt-4 mr-4 absolute" style="max-width:800px">
          <Loader width="30" height="30" />
          <p>Please wait while we register account for you</p>
        </div>
      </div>-->
      <router-view />
    </div>
  </div>
</template>
<script>
import "../output.css";
import * as firebase from "firebase";
import LoginView from "@/views/Home.vue";
export default {
  components: {
    LoginView
  },
  data() {
    return {
      online: navigator.onLine,
      login: false
    };
  },
  async mounted() {
    window.addEventListener("online", () => (this.online = true));
    window.addEventListener("offline", () => (this.online = false));
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user.toJSON()));
        localStorage.setItem("token", await user.getIdToken());
        this.login = true;
      } else {
        this.login = false;
      }
    });
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}

/* #nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
