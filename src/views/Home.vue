<template>
  <div class="home">
    <div class="shadow container bg-white m-auto p-3" style="max-width:800px;">
      <div v-if="message&&message.type==='error'" class="bg-red-500">
        <p class="text-white">{{message.text}}</p>
      </div>
      <div v-if="message&&message.type==='success'" class="bg-green-500">
        <p class="text-white">{{message.text}}</p>
      </div>
      <div v-if="message&&message.type==='warn'" class="bg-orange-500">
        <p class="text-white">{{message.text}}</p>
      </div>
      <div class="mt-1 flex justify-center">
        <button
          class="flex-1"
          @click="form='register'"
          :style="form==='register'?'background-color:#246548':''"
        >
          <p :style="form==='register'?'color:white':''">Register</p>
        </button>
        <button
          :disabled="!online"
          class="flex-1"
          v-bind:class="{ 'opacity-50': !online}"
          @click="form='login'"
          :style="form==='login'?'background-color:#246548':''"
        >
          <p :style="form==='login'?'color:white':''">Login</p>
        </button>
      </div>
      <RegisterForm v-if="form==='register'" @onRegister="onRegister" :isLoading="isLoading" />
      <LoginForm v-else @onLogin="onLogin" :isLoading="isLoading" />
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm.vue";
import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "Home",
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      isLoading: false,
      form: "login",
      message: null,
      online: navigator.onLine
    };
  },
  computed: {
    showLoginForm() {
      return this.form === "login" && navigator.onLine;
    }
  },
  mounted() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
  },
  methods: {
    async onLogin(form) {
      this.isLoading = true;
      try {
        await this.$request.loginAccount(form);
        localStorage.setItem("token", await this.$request.getIdToken());
        this.isLoading = false;
        this.$router.push("/post");
      } catch (err) {
        this.isLoading = false;
        this.message = {
          type: "error",
          text: err.message
        };
      }
    },
    handleOffline() {
      this.online = false;
      this.form = "register";
    },
    async handleOnline() {
      this.online = true;
      const pending = await this.$service.getPendingRegistration();
      if (
        pending &&
        confirm(
          `You have a registration ${pending.email} pending submission. Would you like to submit it?`
        )
      ) {
        this.onRegister(pending);
      }
    },
    async onRegister(details) {
      this.isLoading = true;
      if (navigator.onLine) {
        const res = await this.$request.registerAccount(details);
        if (res.status !== 200) {
          this.message = {
            type: "error",
            text: (await res.json()).message
          };
        } else {
          this.message = {
            type: "success",
            text: "Registration successful"
          };
          this.form = "login";
        }
      } else {
        await this.$service.removePendingRegistration();
        await this.$service.savePendingRegistration(details);
        this.message = {
          type: "warn",
          text: "Offline registration successful"
        };
      }
      this.isLoading = false;
    }
  }
};
</script>
<style scoped>
.home {
  margin-top: 15rem;
}
</style>