import api from "./../api";
import * as firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyBQZeYH-ggNJH6KCpKdn56Cy3S9u31lr4U",
  authDomain: "erudite-phalanx-182813.firebaseapp.com",
  databaseURL: "https://erudite-phalanx-182813.firebaseio.com",
  projectId: "erudite-phalanx-182813",
  storageBucket: "erudite-phalanx-182813.appspot.com",
  messagingSenderId: "751510248652",
  appId: "1:751510248652:web:4b17cdcee16408eb863669",
  measurementId: "G-H09PVJGBFV"
};

firebase.initializeApp(firebaseConfig);

const RequestService = {};
RequestService.install = function(Vue) {
  function registerAccount(form) {
    return api.submitRegistrationForm(form);
  }
  function loginAccount(details) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(details.email, details.password);
  }
  function logoutAccount() {
    return firebase.auth().signOut();
  }

  function getUserDetail() {
    return api.getUserDetail();
  }

  function getMyClass() {
    return api.getMyClass();
  }

  function getMyTeam() {
    return api.getMyTeam();
  }

  function likePost(postId) {
    return api.likePost(postId);
  }

  function getPosts(classroom, onSnapshot) {
    console.log("classroom", classroom);
    const unsubscribe = firebase
      .firestore()
      .collection("post")
      .where("classroom", "==", classroom)
      .orderBy("timestamp")
      .onSnapshot(onSnapshot);
    return unsubscribe;
  }

  function getUserDetails(ids) {
    return api.getUserDetails(ids);
  }

  function getIdToken() {
    return firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
  }
  function getNotifications(onSnapshot) {
    const { uid } = JSON.parse(localStorage.getItem("user"));
    const unsubscribe = firebase
      .firestore()
      .collection("notification")
      .where("user", "==", uid)
      .orderBy("timestamp")
      .onSnapshot(onSnapshot);
    return unsubscribe;
  }

  function followNewClassmates(classroom, onSnapshot) {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("classroom", "==", classroom)
      .orderBy("team")
      .onSnapshot(onSnapshot);
    return unsubscribe;
  }

  Vue.prototype.$request = {
    registerAccount,
    loginAccount,
    getUserDetail,
    logoutAccount,
    getIdToken,
    getMyClass,
    getMyTeam,
    followNewClassmates,
    getPosts,
    getNotifications,
    likePost,
    getUserDetails
  };
};

export default RequestService;
