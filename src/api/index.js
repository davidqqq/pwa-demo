const base =
  process.env.NODE_ENV === "production"
    ? "https://pwa-demo-server2.herokuapp.com"
    : "http://localhost:3000";

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
    }),

  getMyClass: () =>
    fetch(base + "/myclass", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    }),
  getPosts: () =>
    fetch(base + "/post/list", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    }),
  getMyTeam: () =>
    fetch(base + "/myteam", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    }),
  getNotifications: () =>
    fetch(base + "/notification", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    }),
  likePost: postId =>
    fetch(base + "/post/like", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      method: "POST",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      body: JSON.stringify({
        postId
      })
    }),
  // get details from a list of id
  getUserDetails: userId =>
    fetch(base + "/users/detail", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      method: "POST",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      body: JSON.stringify({
        userId
      })
    })
};
