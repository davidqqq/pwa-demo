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
    //   .getIdToken(/* forceRefresh */ true);
  }

  function getIdToken() {
    return firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
  }
  Vue.prototype.$request = {
    registerAccount,
    loginAccount,
    getUserDetail,
    logoutAccount,
    getIdToken
  };
};

export default RequestService;
