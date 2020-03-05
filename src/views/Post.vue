<template>
  <div v-if="email">
    <h2>
      Welcome back,
      <b>{{username}}</b>, you are in class
      <b>{{classroom}}</b> team
      <b>{{team}}</b>
    </h2>
    <h2>Here is a list of your classmates</h2>
    <transition-group name="list-complete" class tag="ul">
      <li
        style="width:10rem;"
        class="list-complete-item m-1 p-1 bg-white whitespace-no-wrap overflow-hidden"
        v-for="(classmate) of classmates"
        :key="classmate.username"
      >
        <img src="https://via.placeholder.com/150" />

        <Tooltip :position="'center'">
          <!-- <p>Username: {{classmate.username}}</p> -->
          <b>Username: {{classmate.username}}</b>
          <div slot="tooltip-content" class="flex flex-col">
            <b>Username: {{classmate.username}}</b>
            <b>User Id: {{classmate.id}}</b>
          </div>
        </Tooltip>
        <p>Team: {{classmate.team}}</p>
      </li>
    </transition-group>

    <h2>Here is a list of your teammates</h2>
    <ul v-if="teammates" class="flex container m-auto">
      <li
        style="width:10rem;"
        class="m-1 p-1 bg-white relative"
        v-for="(teammate,index) of teammates"
        :key="index"
      >
        <b
          class="absolute top-0 left-0 p-3"
          v-if="index === teammates.findIndex(t=>t.id===me.uid)"
        >You are here!</b>
        <img src="https://via.placeholder.com/150" />
        <p>Username: {{teammate.username}}</p>
        <!-- <p>Team: {{classmate.team}}</p> -->
      </li>
    </ul>
    <p>
      Hi,
      <b>{{email}}</b> you can
      <button @click="onLogout">
        <b>logout</b>
      </button> here
    </p>
    <div class="container flex m-auto justify-evenly">
      <div class="bg-white flex-1 m-2 max-w-sm">
        <p>Here is a list of notification</p>
        <div class="bg-white mt-5" v-for="(notification,key) of notifications" :key="key">
          <h1 class="bg-primary text-white font-bold text-lg text-left p-2">{{notification.action}}</h1>
          <p
            class="mt-2 text-left p-2"
          >{{notification.from}} {{notification.message}} {{notification.item}} titled {{notification.item_title}}</p>
          <p class="mt-2 text-xs text-left p-2">{{Date(notification.timestamp)}}</p>
        </div>
        <div class="mt-4" v-if="!posts.length">No notification to show (For demo try Class room B)</div>
      </div>
      <div class="bg-white flex-1 m-2">
        <p>Here is a list of posts</p>
        <div class="mt-5" v-for="(post,key) of posts" :key="key">
          <div class="relative flex w-full">
            <h1 class="bg-primary w-full text-white font-bold text-lg text-left p-2">{{post.title}}</h1>
            <!-- @mouseover="showWhoLikedPost(post.like)" -->
            <button
              @click="()=>likePost(post.postId)"
              :class="`absolute top-0 right-0 ${ post.like.indexOf(me.uid)>-1?'bg-red-400':'bg-gray-300'} font-bold p-1 text-white w-10`"
            >
              <p
                :class="`${ post.like.indexOf(me.uid)>-1?'text-white':'text-black'}`"
              >{{post.like.length}}</p>
            </button>
          </div>
          <p class="mt-2 bg-white text-left p-2">{{post.content}}</p>
          <div class="flex flex-col">
            <textarea />
            <button class="bg-gray-600 font-bold m-2 p-1 text-white">Reply</button>
          </div>
          <div v-for="(reply,key) of post.reply" :key="key">
            <p class="ml-2 mt-1 bg-white text-left p-2">{{reply.content}}</p>
            <p class="ml-2 mt-1 bg-white">{{reply.user}}</p>
          </div>
        </div>
        <div class="mt-4" v-if="!posts.length">No post to show (For demo try Class room B)</div>
      </div>
    </div>
  </div>
  <div v-else>
    <Loader :width="200" :height="200" />Loading.......
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import Tooltip from "@/components/Tooltip.vue";
export default {
  components: {
    Loader,
    Tooltip
  },
  data() {
    return {
      me: JSON.parse(localStorage.getItem("user")),
      email: "",
      classroom: "",
      team: "",
      id: "",
      username: "",
      classmates: [],
      teammates: [],
      posts: [],
      notifications: [],
      unsubscribeNewClassmates: () => {},
      unsubscribeNewPosts: () => {},
      unsubscribeNewNotifications: () => {}
    };
  },
  methods: {
    // async showWhoLikedPost(ids) {
    // await this.$request.getUserDetails(ids);
    // },
    onLogout() {
      this.$request.logoutAccount().then(() => {
        localStorage.removeItem("token");
      });
    },
    likePost(postId) {
      this.$request.likePost(postId);
    },
    async getPosts() {
      this.unsubscribeNewPosts = this.$request.getPosts(
        this.classroom,
        querySnapshot => {
          var posts = [];
          querySnapshot.forEach(function(doc) {
            posts.push({ postId: doc.id, ...doc.data() });
          });
          this.posts = posts;
        }
      );
    },
    async getNotifications() {
      this.unsubscribeNewNotifications = this.$request.getNotifications(
        querySnapshot => {
          var notifications = [];
          querySnapshot.forEach(function(doc) {
            notifications.push(doc.data());
          });
          this.notifications = notifications;
        }
      );
    }
  },
  beforeDestroy() {
    this.unsubscribeNewClassmates();
    this.unsubscribeNewPosts();
    this.unsubscribeNewNotifications();
  },
  async mounted() {
    const res = await this.$request.getUserDetail();
    const userDetails = await res.json();
    this.classroom = userDetails.classroom;
    this.team = userDetails.team;
    this.email = userDetails.email;
    this.id = userDetails.id;
    this.username = userDetails.username;
    // const res2 = await this.$request.getMyClass();
    // this.classmates = await res2.json();
    const res3 = await this.$request.getMyTeam();
    this.teammates = await res3.json();
    this.unsubscribeNewClassmates = this.$request.followNewClassmates(
      this.classroom,
      querySnapshot => {
        var classmates = [];
        querySnapshot.forEach(function(doc) {
          classmates.push(doc.data());
        });
        this.classmates = classmates;
      }
    );
    await this.getNotifications();
    await this.getPosts();
  }
};
</script>

<style >
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
.list-complete-move {
  transition: transform 1s;
}
</style>
