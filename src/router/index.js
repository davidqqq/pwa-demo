import Vue from "vue";
import VueRouter from "vue-router";
import Post from "../views/Post.vue";
import api from "../api";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Post
  },

  {
    path: "/post",
    name: "Post",
    component: Post
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.name === "Post" && from.name !== "Home") {
    if (!localStorage.getItem("token")) next({ name: "Home" });
    const res = await api.getUserDetail();
    res.status === 200 ? next() : next({ name: "Home" });
  } else next();
});

export default router;
