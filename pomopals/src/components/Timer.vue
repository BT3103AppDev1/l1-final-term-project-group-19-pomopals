<template>
  <div class="container">
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
        <p v-if="isResting">Rest!</p>
        <div id="timeDisplay">{{ timeDisplay }}</div>
      </div>
    </div>

    <div class="buttons">
      <button
        v-if="!isSettingTime && this.pomodoroDuration != 0"
        @click="click"
        id="changingButton"
      >
        <img
          v-show="buttonText == 'Start!'"
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
        v-if="!isSettingTime && this.pomodoroDuration != 0 && !isResting"
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
        v-if="!isSettingTime && !isResting"
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
import { firebaseAuth, firestore, db } from "../firebase.js";

export default {
  name: "Home",
  data: function () {
    let pomodoroDuration = 25 * 60;

    return {
      inputDuration: "",
      inputRestDuration: "",
      pomodoroDuration,
      restDuration: 5 * 60,
      currentTimeInSeconds: pomodoroDuration,
      currentSegment: 1,
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
    };
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
      if (this.currentTimeInSeconds <= 0) {
        if (this.currentSegment < 4) {
          this.currentSegment += 1;
        } else {
          this.topRight.set(1);
          this.topLeft.set(1);
          this.bottomRight.set(1);
          this.bottomLeft.set(1);

          this.currentSegment = 1;
        }

        clearInterval(this.interval);

        this.boopAudio.play();

        this.isResting = true;
        this.buttonText = "Rest";

        setTimeout(() => {
          this.currentTimeInSeconds = this.restDuration;

          this.startRest();
        }, 4100);
        console.log("button is now", this.buttonText);

        let userId = firebaseAuth.currentUser.uid; // userId as primary key

        let currentUser = firebaseAuth.currentUser;
        let username = currentUser.displayName; // username as primary key
        console.log(username);
        let userRef = firestore.collection("users").doc(username);
        let doc = await userRef.get();

        // update total xp
        if (doc.exists && doc.data().xp) {
          // xp already has value
          let currXP = doc.data().xp;
          await userRef.update({ xp: currXP + this.pomodoroDuration });
          console.log("xp updated");
        } else {
          await userRef.set({ xp: this.pomodoroDuration });
          console.log("xp created");
        }

        // update xp with time
        let key = new Date().toISOString(); // time whenever xp is written
        let value = this.pomodoroDuration;
        await userRef
          .update({
            [`xpWithTime.${key}`]: value,
          })
          .catch(async (error) => {
            // if map does not exist, populate it with the map
            if (error.code === "not-found") {
              await userRef.set({
                xpWithTime: { [key]: value },
              });
            } else {
              console.error(error);
            }
          });
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
      // Set new interval
      this.reduceTime();
      setTimeout(() => {
        clearInterval(this.interval);
        this.boopAudio.play();
        this.currentTimeInSeconds = this.pomodoroDuration;
        this.buttonText = "Start!";
        this.isResting = false;
      }, this.restDuration * 1000);
      this.$emit("clickOnButtonEvent", this.buttonText);
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
    },

    updateDuration() {
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
      } else {
        alert("Please enter valid durations");
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
      const minutes = String(parseInt(this.currentTimeInSeconds / 60));
      const seconds = String(this.currentTimeInSeconds % 60);
      const paddedMinutes = ("0" + minutes).slice(-2);
      const paddedSeconds = ("0" + seconds).slice(-2);

      return `${paddedMinutes}:${paddedSeconds}`;
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
  top: 40px;
  right: 0;
}
#second-segment {
  position: absolute;
  bottom: -40px;
  right: 0;
}
#third-segment {
  position: absolute;
  bottom: -40px;
  left: 0;
}
#fourth-segment {
  position: absolute;
  top: 40px;
  left: 0;
}

.time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -10%);
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
}

#inputDurationBox,
#inputRestDurationBox {
  width: auto;
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
  margin-top: 30px;
  width: 200px;
  height: 50px;
  border-radius: 20px;
  background-color: white;
  font-size: 36px;
  border: none;
  cursor: pointer;
}
</style>
