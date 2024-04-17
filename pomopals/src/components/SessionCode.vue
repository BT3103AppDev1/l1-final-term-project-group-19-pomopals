<template>
  <div class="sessionCodeContainer">
    <div v-if="viewState == 'start'">
      <button @click="setViewState('host')">Host</button>
      <button @click="setViewState('join')">Join</button>
    </div>
    <div v-if="viewState == 'host'">
      <button id="generateButton" @click="generateCode">
        Generate Session Code
      </button>
      <input type="text" v-model="sessionCode" readonly />
      <button @click="setViewState('start')">Back</button>
    </div>
    <div v-if="viewState == 'join'">
      <input
        type="text"
        v-model="inputCode"
        placeholder="Input Group Code"
        ref="groupCodeInput"
      />
      <button @click="enterCode">Enter</button>
      <button @click="setViewState('start')">Back</button>
    </div>
  </div>
</template>

<script>
import { firebaseAuth, db, firestore } from "../firebase.js";

export default {
  name: "SessionCode",
  data() {
    return {
      sessionCode: "",
      inputCode: "",
      viewState: "start",
    };
  },
  methods: {
    generateCode() {
      this.sessionCode =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      this.$emit("cancelDurationEvent");
      this.$emit("updateSessionCode", this.sessionCode);
      let currentUser = firebaseAuth.currentUser;
      let username = currentUser.displayName; // username as primary key
      let userRef = firestore.collection("groupSession").doc(this.sessionCode);
      let data = {
        active: true,
        host: username,
        members: [],
        restDuration: 0,
        timerDuration: 0,
      };
      userRef.set(data);
      this.$router.push("/host");
    },
    enterCode() {
      this.viewState = "start";
      let sessionCode = this.$refs.groupCodeInput.value;
      let currentUser = firebaseAuth.currentUser;

      if (currentUser) {
        let username = currentUser.displayName;
        let docRef = db.collection("groupSession").doc(sessionCode);

        // Start a batch
        let batch = db.batch();

        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              let data = doc.data();
              let members = data.members || [];
              let host = data.host; // Assuming 'host' is stored directly in the document

              // Check if the current user is the host
              if (username === host) {
                console.log("Host cannot join as a member.");
                alert("You are the host and cannot join as a member.");
              } else if (!members.includes(username)) {
                // Check if user is not already in member array
                members.push(username);
                batch.update(docRef, { members: members });
                batch
                  .commit()
                  .then(() => {
                    console.log("Members updated successfully!");
                    alert("Group joined successfully");
                  })
                  .catch((error) => {
                    console.error("Error updating members: ", error);
                    alert("Error updating group");
                  });
              } else {
                console.log("User already in group");
                alert("You are already a member of this group");
              }
            } else {
              console.log("No such document!");
              alert("No such group found");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
            alert("Error accessing group");
          });
      } else {
        console.log("No user logged in!");
        alert("You need to be logged in to join a group");
      }
    },

    setViewState(state) {
      this.viewState = state;
      this.sessionCode = "";
    },
  },
};
</script>

<style scoped>
.sessionCodeContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 20px;
  z-index: 10;
}

.sessionCodeContainer button {
  display: block;
  margin: 5px 0;
  margin-top: 10px;
  width: 200px;
  height: 68px;
  background: white;
  border-radius: 20px;
  font-size: 36px;
  border: none;
  cursor: pointer;
}

#generateButton {
  font-size: 25px;
}

input[type="text"] {
  margin-top: 10px; /* Additional margin for text inputs */
}
</style>
