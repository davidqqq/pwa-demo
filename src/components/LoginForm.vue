<template>
  <div style="margin:auto;">
    <div style="min-height:8rem;display:flex;flex-direction:column;">
      <input
        class="p-1 mt-2 border hover:border-primary placeholder-gray-800"
        type="email"
        v-model="email"
        placeholder="Email"
      />
      <input
        class="p-1 mt-2 border hover:border-primary placeholder-gray-800"
        type="password"
        v-model="password"
        placeholder="Password"
      />
    </div>
    <button
      class="w-full mt-2 rounded bg-primary text-white"
      @click="()=>!isLoading?$emit('onLogin',{email,password}):''"
    >
      <Loader v-if="isLoading" />
      <span class="font-bold" v-else>Login</span>
    </button>
  </div>
</template>
<script>
import Loader from "@/components/Loader.vue";
export default {
  components: {
    Loader
  },
  props: ["isLoading"],
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: ""
    };
  }
};
</script>