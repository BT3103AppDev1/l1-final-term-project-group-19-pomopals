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
</template>

<script>
import ProgressBar from "progressbar.js";
import boop from "../assets/boop.mp3";
import { firebaseAuth, firestore } from "../firebase.js";

export default {
  name: "Home",
  props: {
    sessionCode: String,
  },
  data: function () {
    let pomodoroDuration = 25 * 60;
    let restDuration = 5 * 60;
    let currentSegment = 1;
    return {
      inputDuration: "",
      inputRestDuration: "",
      pomodoroDuration,
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
        duration: (pomodoroDuration + 1) * 1000, // Updated dynamically below in fetched data
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
      // This will log when the route changes
      this.currentPage = to.name;
      console.log("Route changed to:", this.currentPage);
    },
    pomodoroDuration(newVal) {
      this.pathOptions.duration = (newVal + 1) * 1000;
      this.currentTimeInSeconds = newVal; // Update current time as well
      console.log("hi");
      this.savePomodoroDuration();
    },
    restDuration(newVal) {
      this.saveRestDuration();
    },
    currentSegment(newVal) {
      this.saveCurrentSegment();
    },
  },
  mounted: function () {
    this.topRight = new ProgressBar.Path("#top-right", this.pathOptions);
    this.topRight.set(1);

    this.bottomRight = new ProgressBar.Path("#bottom-right", this.pathOptions);
    this.bottomRight.set(1);

    this.bottomLeft = new ProgressBar.Path("#bottom-left", this.pathOptions);
    this.bottomLeft.set(1);

    this.topLeft = new ProgressBar.Path("#top-left", this.pathOptions);
    this.topLeft.set(1);
  },
  methods: {
    fetchData() {
      const userRef = firestore
        .collection("users")
        .doc(firebaseAuth.currentUser.displayName);

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
    savePomodoroDuration() {
      const userRef = firestore
        .collection("users")
        .doc(firebaseAuth.currentUser.displayName);
      userRef
        .set({ pomodoroDuration: this.pomodoroDuration }, { merge: true })
        .then(() =>
          console.log(
            // console log the current page cuz i cant console log it anywhere else idk
            "Pomodoro duration successfully written in page: ",
            this.currentPage
          )
        )
        .catch((error) =>
          console.error("Error writing pomodoro duration: ", error)
        );
    },
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

    async onFinish() {
      let currentUser = firebaseAuth.currentUser;
      let username = currentUser.displayName; // username as primary key
      let userRef = firestore.collection("users").doc(username);
      let doc = await userRef.get();

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
        this.updateXpInUserFirebase(userRef, doc, calculatedXP);

        // Update xp with time
        await this.updateXpWithTimeInUserFirebase(userRef, calculatedXP);

        // If current page is on HostHomePage, update Xp in groupID document
        if (this.currentPage === "HostHomePage") {
          await this.updateXpInGroupFirebase();
        }
      }
    },

    resetSegments() {
      this.topRight.set(1);
      this.topLeft.set(1);
      this.bottomRight.set(1);
      this.bottomLeft.set(1);
    },

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

    async updateXpInUserFirebase(userRef, doc, calculatedXP) {
      if (doc.exists && doc.data().xp) {
        let currXP = doc.data().xp;
        await userRef.update({ xp: currXP + calculatedXP });
      } else {
        await userRef.set({ xp: calculatedXP }, { merge: true });
      }
    },

    async updateXpWithTimeInUserFirebase(userRef, calculatedXP) {
      let key = new Date().toISOString();
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

    async updateXpInGroupFirebase(calculatedXP) {
      let groupRef = firestore.collection("groupSession").doc(this.sessionCode);
      let doc = await groupRef.get();
      if (doc.exists && doc.data().xp) {
        let currXP = doc.data().xp;
        await groupRef.update({ xp: currXP + calculatedXP });
      } else {
        await groupRef.set({ xp: calculatedXP }, { merge: true });
      }
    },

    reduceTime() {
      this.interval = setInterval(() => {
        if (this.currentTimeInSeconds > 0) {
          this.currentTimeInSeconds -= 1;
        }
      }, 1000);
    },

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

    showInputBox() {
      this.isSettingTime = true;
      this.restartDuration();
    },

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

    restartDuration() {
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
  transform: translateY(-25px);
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
