<template>
  <div class="sessionCodeContainer">
    <div v-if="viewState == 'start'">
      <button @click="setViewState('host')">Host</button>
      <p1>|</p1>
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
      this.$emit("generatedSessionCode", this.sessionCode);
      let currentUser = firebaseAuth.currentUser;
      let username = currentUser.displayName; // username as primary key
      let userRef = firestore.collection("groupSession").doc(this.sessionCode);
      let data = {
        active: true,
        host: username,
        members: [],
        restDuration: 0,
        timerDuration: 0,
        xp: 0,
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
      const userDocRef = firestore.collection("users").doc(username);
      userDocRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          let currentCount = docSnapshot.data().groupstudy;
          currentCount = currentCount ? currentCount + 1 : 1;
          userDocRef
            .update({ groupstudy: currentCount })
            .then(() => {
              console.log("groupstudy count incremented successfully");
            })
            .catch((error) => {
              console.error("Error incrementing groupstudy count:", error);
            });
        } else {
          userDocRef
            .set({ groupstudy: 1 })
            .then(() => {
              console.log(
                "groupstudy attribute added and set to 1 successfully"
              );
            })
            .catch((error) => {
              console.error("Error setting groupstudy attribute:", error);
            });
        }
      });
    },
    // adds user to the members array of the group session document
    enterCode() {
      this.viewState = "start";
      let sessionCode = this.$refs.groupCodeInput.value;
      this.$emit("enteredSessionCode", this.sessionCode);
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
              let host = data.host;

              // Check if the current user is the host
              if (username === host) {
                console.log("Host cannot join as a member.");
                alert("You are the host and cannot join as a member.");
              } else if (!members.includes(username)) {
                // User is not the host and is not already a member, proceed to join
                members.push(username);
                batch.update(docRef, { members: members });

                // Get a reference to the user's document in the users collection
                const userDocRef = db.collection("users").doc(username);

                // Manually increment the `groupstudy` field
                userDocRef
                  .get()
                  .then((userDoc) => {
                    if (userDoc.exists) {
                      let userDocData = userDoc.data();
                      let groupstudyCount = userDocData.groupstudy || 0;
                      groupstudyCount += 1; // Manually increment

                      // Update the `groupstudy` field with the new count
                      batch.update(userDocRef, { groupstudy: groupstudyCount });
                    } else {
                      // If the user document doesn't exist, initialize `groupstudy` with 1
                      batch.set(userDocRef, { groupstudy: 1 });
                    }

                    // Commit the batch
                    batch
                      .commit()
                      .then(() => {
                        console.log(
                          "Members and groupstudy count updated successfully!"
                        );
                        alert("Group joined successfully");
                        this.$router.push({
                          path: "/member",
                          query: { sessionCode: sessionCode },
                        });
                      })
                      .catch((error) => {
                        console.error(
                          "Error updating members or groupstudy count: ",
                          error
                        );
                        alert("Error updating group");
                      });
                  })
                  .catch((error) => {
                    console.error(
                      "Error getting user document for groupstudy count:",
                      error
                    );
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
            console.error("Error getting group session document:", error);
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

p1 {
  color: white;
  font-size: 25px;
}

/* Styles for buttons */
.sessionCodeContainer button {
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.6rem;
  color: white;
  font-weight: 600;
  text-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 100);
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
