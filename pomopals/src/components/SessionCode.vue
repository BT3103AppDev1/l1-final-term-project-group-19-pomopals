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

      <button id="leaveButton" @click="setViewState('start')">
        <img src="@/assets/leave.png" width="20" alt="Leave" />
      </button>
    </div>
    <div v-if="viewState == 'join'">
      <input
        type="text"
        v-model="inputCode"
        placeholder="Input Group Code"
        ref="groupCodeInput"
      />
      <button @click="enterCode">Enter</button>
      <button id="leaveButton" @click="setViewState('start')">
        <img src="@/assets/leave.png" width="20" alt="Leave" />
      </button>
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
    // generates unique code upon click; if time is still running, clicking this button will auto cancel the timer
    generateCode() {
      this.sessionCode =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      this.$emit("cancelDurationEvent");
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
      userRef
        .set(data)
        .then(() => {
          // Only navigate once the Firestore set is successful
          this.$router.push({
            path: "/host",
            query: { sessionCode: this.sessionCode },
          });
        })
        .catch((error) => {
          console.error("Error setting session data:", error);
        });
    },
    // adds user to the members array of the group session document
    enterCode() {
      this.viewState = "start";
      let sessionCode = this.$refs.groupCodeInput.value;
      let currentUser = firebaseAuth.currentUser;

      if (currentUser) {
        let username = currentUser.displayName;
        let userRef = db.collection("groupSession").doc(sessionCode);

        // Start a batch
        let batch = db.batch();

        userRef
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
                batch.update(userRef, { members: members });
                batch
                  .commit()
                  .then(() => {
                    console.log("Members updated successfully!");
                    alert("Group joined successfully");
                    // Only navigate once the Firestore set is successful
                    this.$router.push({
                      path: "/member",
                      query: { sessionCode: this.sessionCode },
                    });
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
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center children horizontally in the container */
  justify-content: center; /* Center children vertically in the container */
  position: fixed; /* Fix position relative to the viewport */
  left: 50%; /* Position the left edge of the container in the middle of the viewport */
  bottom: 0; /* Align the container to the bottom of the viewport */
  transform: translateX(
    -50%
  ); /* Shift the container left by half its width to center it */
  z-index: 1000; /* Ensure it sits above other content; adjust as necessary */
}

/* You may want to add styles for the buttons and inputs to ensure they look good when centered */
.sessionCodeContainer button,
.sessionCodeContainer input[type="text"] {
  margin: 0.5rem; /* Spacing around buttons and input */
  /* Additional styles for buttons and input */
}

/* Styles for buttons */
.sessionCodeContainer button {
  padding: 10px 20px;
  border: none;
  background-color: #f4f7fa; /* Example background color, change as desired */
  border-radius: 5px;
  cursor: pointer;
}

/* Styles for inputs */
.sessionCodeContainer input[type="text"] {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}

#leaveButton {
  width: 100%;
  max-width: 20px;
  height: auto;
  background: transparent;
  border: 0;
}
</style>
