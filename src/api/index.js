const base = "https://pwa-demo-server2.herokuapp.com";
export default {
  submitRegistrationForm: form =>
    fetch(base + "/register", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      body: JSON.stringify(form)
    }),

  getUserDetail: () =>
    fetch(base + "/user/detail", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    })
};
