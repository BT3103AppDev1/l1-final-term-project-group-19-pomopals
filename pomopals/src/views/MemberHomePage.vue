<template>
  <div class="overlay">
    <!-- <div class = "toggle">
      <ToggleURL/>
    </div> -->
    <div class="home">
      <span id="boostedXPStatement"
        >You’ve earned an XP boost! Enjoy 1.5x XP this session.</span
      >
      <div id="xpBar">
        <XpBar />
      </div>
      <div><Timer :isHost="false" /></div>
      <div id="sessionInfo">
        <span id="sessionCode">Session Code: {{ sessionCode }}</span>
        <div id="groupMembers">
          <div
            v-for="(member, index) in members"
            :key="index"
            class="member-badge"
          >
            {{ member }}
          </div>
          <img
            src="@/components/icons/leave.svg"
            alt="Leave"
            class="leave-icon"
            @click="leaveSession"
          />
        </div>
        <div id="memberCount">
          {{ members.length }} members in this group session
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from "/src/components/Timer.vue";
import XpBar from "/src/components/XpBar.vue";
import ToggleURL from "@/components/ToggleURL.vue"
import { firebaseAuth, db } from "@/firebase";
import firebase from "@/firebase";

export default {
  name: "MemberHomePage",
  components: { Timer, XpBar, ToggleURL },
  methods: {
    fetchSessionDetails() {
      const sessionRef = firebase
        .firestore()
        .collection("groupSession")
        .doc(this.sessionCode);
      sessionRef.onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();

            const membersArray = [data.host, ...(data.members || [])];
            this.members = [...membersArray];
            console.log(this.members);
            console.log("Real-time update of group members:", this.members);
          } else {
            console.error("No such session exists!");
          }
        },
        (error) => {
          console.error("Error fetching session details:", error);
        }
      );
    },
    leaveSession() {
      if (window.confirm("Are you sure you want to leave the session?")) {
        const username = firebaseAuth.currentUser.displayName;
        const sessionRef = db.collection("groupSession").doc(this.sessionCode);

        sessionRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              let data = doc.data();
              let members = data.members || [];

              if (members.includes(username)) {
                // Remove user from the members array
                members = members.filter((member) => member !== username);
                sessionRef
                  .update({ members: members })
                  .then(() => {
                    console.log(username + " has left the session.");
                    this.$router.push("/home");
                  })
                  .catch((error) => {
                    console.error(
                      "Error removing member from session: ",
                      error
                    );
                  });
              }
            } else {
              console.error("No such session exists!");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
      }
    },
  },
  data() {
    return {
      sessionCode: "",
      members: [],
    };
  },
  created() {
    // set sessionCode based on router query parameter
    this.sessionCode = this.$route.query.sessionCode;
    this.fetchSessionDetails();
    console.log("Received session code:", this.sessionCode);
  },
  computed: {
    memberCount() {
      return `${this.members.length} member(s) in this group session`;
    },
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden; 
  background-color: #f0f0f0; 
  font-family: "Lucida Sans", Arial, sans-serif; 
}
#sessionInfo {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  left: 50%;
}
#sessionCode {
  font-size: 1.15rem;
  color: white;
  font-weight: 500;
  z-index: 10;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

#friendsButton,
#leaderboardButton {
  position: absolute;
  top: 20%;
  right: 10px;
}

#friendsButton {
  transform: translateY(-100%);
}

#groupMembers {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin: 0;
  width: 80vw; /* Use viewport width for responsive control */
  max-width: 600px; /* Adjust based on your design preference */
  flex-wrap: wrap;
  gap: 1px;
}

.member-badge {
  background-color: white; /* White background for the badge */
  color: black; /* Black text for readability */
  border-radius: 35px;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0.2rem;
  margin-bottom: 3px;
  font-weight: bold;
  text-align: center;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); /* Subtle shadow for depth */
  cursor: pointer; /* Cursor pointer to indicate button functionality */
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

.member-badge:hover {
  background-color: #e8e8e8; /* Slightly darker background on hover */
}

#navBar,
#xpBar,
#timerWrapper {
  margin-bottom: 2vh; /* This provides spacing between your components */
}

#memberCount {
  text-align: center;
  color: white;
  font-size: 1.15rem;
  margin-top: 1px;
  font-weight: 500;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.leave-icon {
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-top: 5px;
  cursor: pointer;
  fill: white;
}
#xpBar {
  transform: translateY(100%);
}
#boostedXPStatement {
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateY(110%);
  margin-bottom: -50px;
  text-align: center;
  font-size: 1.6rem;
  color: white;
  font-size: 15px;
  font-weight: 450;
  text-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 100);
}

.toggle {
    position: absolute; 
    bottom: 10px; 
    left: 30px; 
    padding: 10px; 
}
</style>
