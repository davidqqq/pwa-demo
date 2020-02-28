<template>
  <div v-if="email">
    <h2>Welcome back, {{email}}, you are in class {{classroom}}</h2>
    <button @click="onLogout">Logout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      classroom: ""
    };
  },
  methods: {
    onLogout() {
      this.$request.logoutAccount().then(() => {
        localStorage.removeItem("token");
        this.$router.push("/");
      });
    }
  },
  async mounted() {
    const res = await this.$request.getUserDetail();
    const userDetails = await res.json();
    this.classroom = userDetails.classroom;
    this.email = userDetails.email;
  }
};
</script>

<style>
</style>