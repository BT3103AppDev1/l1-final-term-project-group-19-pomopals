<template>
  <button id="leaveButton" @click="leaveGroupSession">
    <img src="@/assets/leave.png" width="20" alt="Leave" />
  </button>
</template>

<script>
import { firebaseAuth, db, firestore } from "../firebase.js";

export default {
  name: "LeaveButton",
  methods: {
    leaveGroupSession() {},
  },
};
</script>

<style scoped>
#leaveButton {
  width: 100%;
  max-width: 20px;
  height: auto;
  background: transparent;
  border: 0;
}
</style>
