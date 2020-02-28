<template>
  <div class="m-auto">
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
      <select
        v-model="classroom"
        name="classroom"
        class="p-1 mt-2 border hover:border-primary placeholder-gray-800"
      >
        <option value>--Please choose an option--</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="E">E</option>
        <option value="F">F</option>
      </select>
    </div>
    <button
      class="w-full mt-2 rounded bg-primary text-white"
      @click="$emit('onRegister',{email,password,classroom})"
    >
      <Loader v-if="isLoading" />
      <p class="font-bold" v-else>Register</p>
    </button>
  </div>
</template>
<script>
import Loader from "@/components/Loader.vue";
export default {
  components: {
    Loader
  },
  name: "RegisterForm",
  props: ["isLoading"],
  data() {
    return {
      email: "",
      password: "",
      classroom: ""
    };
  }
};
</script>