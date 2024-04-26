<template>
  <div class="container">
    <div class="stateBanner">
      <div
        id="studyBox"
        :class="{
          enlarge: this.buttonText == 'Pause' || this.buttonText == 'Resume',
        }"
      >
        <span id="study">Study</span>
      </div>
      <div id="restBox" :class="{ highlight: isResting, enlarge: isResting }">
        <span id="rest">Rest</span>
      </div>
    </div>

    <div class="timer">
      <svg
        width="163"
        height="165"
        viewBox="-8 -8 184 188"
        fill="none"
        id="first-segment"
      >
        <path
          stroke="#E9D2B1"
          stroke-width="15"
          stroke-linecap="round"
          d="M165.16,163.38A172,172,0,0,0,0,0"
        />
        <path
          id="top-right"
          stroke="#FFFFFF"
          stroke-width="15"
          stroke-linecap="round"
          d="M165.16,163.38A172,172,0,0,0,0,0"
        />
      </svg>
      <svg
        width="163"
        height="165"
        viewBox="-8 -8 184 188"
        fill="none"
        id="second-segment"
      >
        <path
          stroke="#E9D2B1"
          stroke-width="15"
          stroke-linecap="round"
          d="M0,163.34A172,172,0,0,0,164.44,0"
        />
        <path
          id="bottom-right"
          stroke="#FFFFFF"
          stroke-width="15"
          stroke-linecap="round"
          d="M0,163.34A172,172,0,0,0,164.44,0"
        />
      </svg>
      <svg
        width="163"
        height="165"
        viewBox="-8 -8 184 188"
        fill="none"
        id="third-segment"
      >
        <path
          stroke="#E9D2B1"
          stroke-width="15"
          stroke-linecap="round"
          d="M0,0A172,172,0,0,0,165.16,162.61"
        />
        <path
          id="bottom-left"
          stroke="#FFFFFF"
          stroke-width="15"
          stroke-linecap="round"
          d="M0,0A172,172,0,0,0,165.16,162.61"
        />
      </svg>
      <svg
        width="163"
        height="165"
        viewBox="-8 -8 184 188"
        fill="none"
        id="fourth-segment"
      >
        <path
          stroke="#E9D2B1"
          stroke-width="15"
          stroke-linecap="round"
          d="M160.17,0A172,172,0,0,0,0,161.51"
        />
        <path
          id="top-left"
          stroke="#FFFFFF"
          stroke-width="15"
          stroke-linecap="round"
          d="M160.17,0A172,172,0,0,0,0,161.51"
        />
      </svg>
      <div class="time">
        <div id="timeDisplay">{{ timeDisplay }}</div>
      </div>
    </div>
    <div v-if="isHost">
      <div class="buttons">
      <button
        v-if="!isSettingTime"
        :disabled="isResting"
        @click="click"
        id="changingButton"
      >
        <img
          v-show="buttonText == 'Start!' || isResting"
          src="@/assets/start.png"
          id="startButton"
          alt="Start!"
        />
        <img
          v-show="buttonText == 'Pause'"
          src="@/assets/pause.png"
          id="pauseButton"
          alt="Pause"
        />
        <img
          v-show="buttonText == 'Resume'"
          src="@/assets/resume.png"
          id="resumeButton"
          alt="Resume"
        />
      </button>

      <button
        v-if="!isSettingTime && this.pomodoroDuration != 0"
        :disabled="isResting"
        id="restartButton"
        @click="restartDuration"
      >
        <img src="@/assets/restart.png" alt="Restart" />
      </button>

      <div v-if="isSettingTime">
        <input
          id="inputDurationBox"
          type="number"
          v-model="inputDuration"
          placeholder="Work duration in minutes"
        />
        <input
          id="inputRestDurationBox"
          type="number"
          v-model="inputRestDuration"
          placeholder="Rest duration in minutes"
        />
        <button id="updateButton" @click="updateDuration">Update</button>
      </div>

      <button
        v-if="!isSettingTime"
        :disabled="isResting"
        @click="showInputBox"
        id="settingButton"
      >
        <img src="@/assets/settings.png" alt="Settings" />
      </button>
    </div>
    </div>
    
  </div>
</template>

<script>
import ProgressBar from "progressbar.js";
import boop from "../assets/boop.mp3";
import { firebaseAuth, firestore } from "../firebase.js";
import firebase from "../firebase.js";

export default {
  name: "Home",
  props: {
    // passed as props from sessionCode.vue
    sessionCode: String,
    isHost: {
      type: Boolean,
      default: false
    }
  },
  firestore() {
    return {
      session: firestore.collection("groupSession").doc(this.sessionCode),
    };
  },
  data: function () {
    let pomodoroDuration = 25 * 60;
    let restDuration = 5 * 60;
    let currentSegment = 1;
    return {
      inputDuration: "",
      inputRestDuration: "",
      pomodoroDuration,
      currentUser: null,
      restDuration,
      currentTimeInSeconds: pomodoroDuration,
      currentSegment,
      buttonText: "Start!",
      topRight: null,
      bottomRight: null,
      bottomLeft: null,
      topLeft: null,
      pathOptions: {
        easing: "linear",
        duration: (pomodoroDuration + 1) * 1000,
      },
      interval: null,
      boopAudio: new Audio(boop),
      isResting: false,
      isSettingTime: false,
      currentPage: "",
    };
  },
  created() {
    this.fetchData();
    this.currentPage = this.$route.name;
  },
  watch: {
    $route(to, from) {
      // watch when routed page changes
      this.currentPage = to.name;
      console.log("Route changed to:", this.currentPage);
    },

    // watch for changes in sessionCode prop
    sessionCode(newValue) {
      console.log("sessionCode prop changed to:", newValue);
    },
    // watch for changes in groupSession's XP
    "session.timeStamp"(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("timeStamp in groupSession changed");
        this.handleTimeUpdate();
      }
    },

    // watch for changes in pomodoroDuration
    pomodoroDuration(newVal) {
      this.pathOptions.duration = (newVal + 1) * 1000;
      this.currentTimeInSeconds = newVal; // Update current time as well
      this.savePomodoroDuration();
    },

    // watch for changes in restDuration
    restDuration(newVal) {
      this.saveRestDuration();
    },

    // watch for changes in currentSegment
    currentSegment(newVal) {
      this.saveCurrentSegment();
    },
  },
  mounted() {
    // Initialize progress bars
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userName = user.displayName;
        this.initializeProgressBars();
        this.fetchData();
      } else {
        // Handle the case where there is no user logged in
        // Possibly redirect to login page or show a message
        console.error("No user is logged in. Redirecting to login page.");
        this.$router.push("/login");
      }
    });
  },
  
  methods: {
    // handle updating of xp for members in a groupSession when timeStamp changes
    initializeProgressBars() {
      this.topRight = new ProgressBar.Path("#top-right", this.pathOptions);
      this.topRight.set(1);

      this.bottomRight = new ProgressBar.Path("#bottom-right", this.pathOptions);
      this.bottomRight.set(1);

      this.bottomLeft = new ProgressBar.Path("#bottom-left", this.pathOptions);
      this.bottomLeft.set(1);

      this.topLeft = new ProgressBar.Path("#top-left", this.pathOptions);
      this.topLeft.set(1);
    },
    async handleTimeUpdate() {
      let currentUser = firebaseAuth.currentUser;
      let username = currentUser.displayName; // username as primary key
      let userRef = firestore.collection("users").doc(username);
      let doc = await userRef.get();
      const sessionData = this.session;
      if (sessionData.members.includes(username)) {
        this.updateXpInUserFirebase(userRef, sessionData.xp);
        this.updateXpWithTimeInUserFirebase(userRef, sessionData.xp);
      }
    },

    // fetch timer data from users collection
    fetchData() {
      const userRef = firestore
        .collection("users")
        .doc(this.userName);

      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data();
            this.pomodoroDuration =
              data.pomodoroDuration || this.pomodoroDuration;
            this.restDuration = data.restDuration || this.restDuration;
            this.currentSegment = data.currentSegment || this.currentSegment;
            // Adjust pathOptions and currentTimeInSeconds if needed
            this.pathOptions.duration = (this.pomodoroDuration + 1) * 1000;
            this.currentTimeInSeconds = this.pomodoroDuration;
          } else {
            console.log("No such document!");
            // Consider whether to save defaults if no document exists
            this.savePomodoroDuration();
            this.saveRestDuration();
            this.saveCurrentSegment();
          }
          this.updateCurrentSegment(); // updates current quadrant
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    },

    // saves pomodoroDuration to firebase
    savePomodoroDuration() {
      const userRef = firestore
        .collection("users")
        .doc(this.userName);
      userRef
        .set({ pomodoroDuration: this.pomodoroDuration }, { merge: true })
        .then(() =>
          console.log(
            "Pomodoro duration successfully written!",
            this.currentPage
          )
        )
        .catch((error) =>
          console.error("Error writing pomodoro duration: ", error)
        );
    },

    // saves restDuration to firebase
    saveRestDuration() {
      const userRef = firestore
        .collection("users")
        .doc(firebaseAuth.currentUser.displayName);
      userRef
        .set({ restDuration: this.restDuration }, { merge: true })
        .then(() => console.log("Rest duration successfully written!"))
        .catch((error) =>
          console.error("Error writing rest duration: ", error)
        );
    },

    // saves segment to firebase
    saveCurrentSegment() {
      const userRef = firestore
        .collection("users")
        .doc(firebaseAuth.currentUser.displayName);
      userRef
        .set({ currentSegment: this.currentSegment }, { merge: true })
        .then(() => console.log("currentSegment successfully written!"))
        .catch((error) =>
          console.error("Error writing currentSegment: ", error)
        );
    },

    // update segment to firebase
    updateCurrentSegment() {
      if (this.currentSegment == 1) {
        this.topRight.set(1);
        this.topLeft.set(1);
        this.bottomRight.set(1);
        this.bottomLeft.set(1);
      } else if (this.currentSegment == 2) {
        this.topRight.set(0);
        this.topLeft.set(1);
        this.bottomRight.set(1);
        this.bottomLeft.set(1);
      } else if (this.currentSegment == 3) {
        this.topRight.set(0);
        this.topLeft.set(1);
        this.bottomRight.set(0);
        this.bottomLeft.set(1);
      } else if (this.currentSegment == 4) {
        this.topRight.set(0);
        this.topLeft.set(1);
        this.bottomRight.set(0);
        this.bottomLeft.set(0);
      }
    },

    // handles clicking of the start/pause/resume button
    click() {
      if (this.buttonText === "Start!" || this.buttonText === "Resume") {
        this.animateBar();
        this.buttonText = "Pause";
        this.$emit("clickOnButtonEvent", this.buttonText);
      } else if (this.buttonText === "Pause") {
        this.pauseBar();
        this.buttonText = "Resume";
        this.$emit("clickOnButtonEvent", this.buttonText);
      }
      this.$emit("clickOnButtonEvent", this.buttonText);
    },

    // handles the event of pausing the bar
    pauseBar() {
      clearInterval(this.interval);
      switch (this.currentSegment) {
        case 1:
          this.topRight.stop();
          break;
        case 2:
          this.bottomRight.stop();
          break;
        case 3:
          this.bottomLeft.stop();
          break;
        case 4:
          this.topLeft.stop();
          break;
      }
    },

    // handles event when study timer hits 0
    async onFinish() {
      let currentUser = firebaseAuth.currentUser;
      let username = currentUser.displayName; // username as primary key
      let userRef = firestore.collection("users").doc(username);
      let doc = await userRef.get();
      let groupRef = firestore
        .collection("groupSession")
        .doc(this.computedSessionCode);
      console.log("saving xp to groupID:", this.computedSessionCode);

      //i added this in!
      groupRef.get().then((doc) => {
          if (doc.exists) {
              let data = doc.data();
              if (data.members && data.members.length === 0) {
                  // GRP SESH HAS NO MEMBERS - DO NOT ALLOW XP 
                  alert("You are the only user in the group session. Please invite other users to use this feature. ")
                  console.log("There are no members in the group session.");
              } else {
                  //ALLOW
                  console.log("There are members in the group session.");
              }
          } else {
              console.log("No such group!");
          }
      }).catch((error) => {
          console.log("Error retreiving group session data:", error);
      });


      if (this.currentTimeInSeconds <= 0) {
        if (this.currentSegment < 4) {
          this.currentSegment += 1;
        } else {
          this.resetSegments();
          this.currentSegment = 1;
        }
        // Update segment in Firebase
        this.updateSegmentInUserFirebase(userRef, doc);

        // timer animation and stuff
        clearInterval(this.interval);
        this.isResting = true;
        this.buttonText = "Rest";
        setTimeout(() => {
          this.currentTimeInSeconds = this.restDuration;
          this.boopAudio.play();
          this.startRest();
        });

        // Calculate XP based on the current page
        let calculatedXP = this.pomodoroDuration; // Start with base duration
        if (
          this.currentPage === "HostHomePage" ||
          this.currentPage === "MemberHomePage"
        ) {
          calculatedXP *= 1.5; // Apply multiplier if on specific pages
        }

        // Update XP in Firebase
        this.updateXpInUserFirebase(userRef, calculatedXP);

        // Update xp with time
        await this.updateXpWithTimeInUserFirebase(userRef, calculatedXP);

        // If current page is on HostHomePage, update Xp in groupID document
        if (this.currentPage == "HostHomePage") {
          this.updateXpInGroupFirebase(groupRef, calculatedXP);
        }
      }
    },

    // resets the segments of the timer back to the original
    resetSegments() {
      this.topRight.set(1);
      this.topLeft.set(1);
      this.bottomRight.set(1);
      this.bottomLeft.set(1);
    },

    // updates the current segment of the timer to firebase
    async updateSegmentInUserFirebase(userRef, doc) {
      if (doc.exists && doc.data().currentSegment) {
        await userRef.update({ currentSegment: this.currentSegment });
      } else {
        await userRef.set(
          { currentSegment: this.currentSegment },
          { merge: true }
        );
      }
    },

    // updates the total xp of the user in firebase
    async updateXpInUserFirebase(userRef, calculatedXP) {
      let doc = await userRef.get();
      if (doc.exists && doc.data().xp) {
        let currXP = doc.data().xp;
        await userRef.update({ xp: currXP + calculatedXP });
      } else {
        await userRef.set({ xp: calculatedXP }, { merge: true });
      }
    },

    // updates the xpWithTime of the user in firebase
    async updateXpWithTimeInUserFirebase(userRef, calculatedXP) {
      let key = new Date().toISOString();
      console.log(this.computedSessionCode);
      let value = calculatedXP;
      await userRef
        .update({ [`xpWithTime.${key}`]: value })
        .catch(async (error) => {
          if (error.code === "not-found") {
            await userRef.set(
              { xpWithTime: { [key]: value } },
              { merge: true }
            );
          } else {
            console.error(error);
          }
        });
    },

    // updates the total xp in the groupID document in firebase
    async updateXpInGroupFirebase(groupRef, calculatedXP) {
      await groupRef.set({ xp: calculatedXP }, { merge: true });
    },

    // handles the reduction in time for the timer
    reduceTime() {
      this.interval = setInterval(() => {
        if (this.currentTimeInSeconds > 0) {
          this.currentTimeInSeconds -= 1;
        }
      }, 1000);
    },

    // handles the event of the rest timer
    startRest() {
      // set new interval
      this.reduceTime();
      setTimeout(() => {
        clearInterval(this.interval);
        this.boopAudio.play();
        this.currentTimeInSeconds = this.pomodoroDuration;
        this.buttonText = "Start!";
        this.isResting = false;
        this.$emit("clickOnButtonEvent", this.buttonText);
      }, this.restDuration * 1000);
    },

    // handles the animation of the timer
    animateBar() {
      this.reduceTime();
      let segment = null;
      switch (this.currentSegment) {
        case 1:
          segment = this.topRight;
          break;
        case 2:
          segment = this.bottomRight;
          break;
        case 3:
          segment = this.bottomLeft;
          break;
        case 4:
          segment = this.topLeft;
          break;
      }
      segment.animate(
        0,
        {
          duration: (this.currentTimeInSeconds + 1) * 1000,
        },
        this.onFinish
      );
    },

    // handles the appearance of the input boxes for updating of the timer
    showInputBox() {
      this.isSettingTime = true;
      this.restartDuration();
    },

    // handles the event of updating the timer durations
    async updateDuration() {
      let duration = Number(this.inputDuration);
      let restDuration = Number(this.inputRestDuration);
      if (
        !isNaN(duration) &&
        duration > 0 &&
        !isNaN(restDuration) &&
        restDuration > 0
      ) {
        this.pomodoroDuration = duration * 60;
        this.currentTimeInSeconds = this.pomodoroDuration;
        this.pathOptions.duration = (this.pomodoroDuration + 1) * 1000;
        this.restDuration = restDuration * 60;
        this.isSettingTime = false;

        let currentUser = firebaseAuth.currentUser;
        let username = currentUser.displayName; // username as primary key
        let userRef = firestore.collection("users").doc(username);
        let doc = await userRef.get();

        // update pomodoro time
        if (doc.exists && doc.data().pomodoroDuration) {
          // pomodoroDuration already has value
          let currPomodoroDuration = doc.data().pomodoroDuration;
          await userRef.update({ pomodoroDuration: this.pomodoroDuration });
          console.log("pomodoroDuration updated");
        } else {
          await userRef.set(
            { pomodoroDuration: this.pomodoroDuration },
            { merge: true }
          );
          console.log("pomodoroDuration created");
        }

        // update rest time
        if (doc.exists && doc.data().restDuration) {
          // restDuration already has value
          let currRestDuration = doc.data().restDuration;
          await userRef.update({ restDuration: this.restDuration });
          console.log("restDuration updated");
        } else {
          await userRef.set(
            { restDuration: this.restDuration },
            { merge: true }
          );
          console.log("restDuration created");
        }
      } else {
        alert("Please input valid timings!");
      }
    },

    // handles the event of restarting the timer
    restartDuration() {
      console.log(this.sessionCode);
      clearInterval(this.interval);

      if (this.topRight) this.topRight.stop();
      if (this.bottomRight) this.bottomRight.stop();
      if (this.bottomLeft) this.bottomLeft.stop();
      if (this.topLeft) this.topLeft.stop();

      this.currentTimeInSeconds = this.pomodoroDuration;

      this.isResting = false;
      this.buttonText = "Start!";
      this.$emit("clickOnButtonEvent", this.buttonText);

      this.currentSegment = 1;

      this.topRight.set(1);
      this.bottomRight.set(1);
      this.bottomLeft.set(1);
      this.topLeft.set(1);
    },
  },
  computed: {
    // allows pomodoroDuration and restDuration to be logged onto the screen
    timeDisplay() {
      const totalSeconds = this.currentTimeInSeconds;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const paddedHours = ("0" + hours).slice(-2);
      const paddedMinutes = ("0" + minutes).slice(-2);
      const paddedSeconds = ("0" + seconds).slice(-2);

      if (hours > 0) {
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
      } else {
        return `${paddedMinutes}:${paddedSeconds}`;
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  text-align: center;
}
.timer {
  position: relative;
  width: 330px;
  height: 330px;
}
#first-segment {
  position: absolute;
  top: 25px;
  right: 0;
}
#second-segment {
  position: absolute;
  bottom: -25px;
  right: 0;
}
#third-segment {
  position: absolute;
  bottom: -25px;
  left: 0;
}
#fourth-segment {
  position: absolute;
  top: 25px;
  left: 0;
}
.time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -25%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#timeDisplay {
  font-size: 64px;
  color: white;
}
p {
  font-size: 48px;
  line-height: 48px;
  text-align: center;
  color: white;
}
.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
  transform: translate(-6%, 20%);
}
#inputDurationBox,
#inputRestDurationBox {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 5px;
}

#changingButton,
#startButton,
#resumeButton,
#pauseButton,
#settingButton,
#restartButton {
  width: 100%;
  max-width: 100px;
  height: auto;
  background: transparent;
  border: 0;
  width: 70px;
}

#updateButton {
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 25px;
  color: white;
}
.stateBanner {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transform: translateY(-10px);
}

#studyBox,
#restBox {
  box-sizing: border-box;
  position: absolute;
  width: 163px;
  height: 45px;
  background: #ffffff;
  border: 3px solid #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.enlarge {
  transform: scale(1.35);
}

#studyBox {
  left: calc(50% - 216px);
}

#restBox {
  left: calc(50% + 53px);
}

#study,
#rest {
  position: absolute;
  width: 79px;
  height: 41px;
  left: 42px;
  top: 2px;
  font-family: "Space Grotesk";
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 35px;
  text-align: center;
  color: #3a0404;
}
</style>
