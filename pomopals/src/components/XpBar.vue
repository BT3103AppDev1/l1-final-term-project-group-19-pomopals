<template>
  <div class="xpBar">
    <span id="totalXP"> Current XP: {{ totalXP }}</span>
  </div>
</template>

<script>
import { firebaseAuth, firestore } from "../firebase.js";

export default {
  name: "XpBar",
  data() {
    return {
      totalXP: null,
    };
  },
  mounted() {
    this.handleAuthStateChanged();
  },
  methods: {
    handleAuthStateChanged() {
      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, fetch the data
          this.fetchUserData(user.displayName);
        } else {
          // No user is signed in
          this.totalXP = "User not logged in";
        }
      });
    },
    fetchUserData(username) {
      let userRef = firestore.collection("users").doc(username);
      userRef.onSnapshot(
        (doc) => {
          if (doc.exists && doc.data().xp !== undefined) {
            // Checks if the document exists and xp is not undefined
            this.totalXP = doc.data().xp;
          } else if (doc.exists) {
            // Document exists but xp might be undefined
            this.totalXP = 0;
          } else {
            // Document does not exist
            this.totalXP = "User data unavailable";
          }
        },
        (error) => {
          console.error("Error fetching XP data:", error);
          this.totalXP = "Error fetching data";
        }
      );
    },
  },
};
</script>

<style scoped>
.xpBar {
  position: absolute;
  width: 263px;
  height: 55px;
  left: 498px;
  top: 50px;
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: #ffffff;
}
</style>
