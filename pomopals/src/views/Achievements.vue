<template>
  <div class="achievementPage">
    <NavBar id="navbar" />
    <div class="signOut">
      <SignOutButton />
    </div>
    <div id="headerContainer">
      <h1 id="myAchievementsHeader">My Achievements</h1>
    </div>
    <div id="viewAllContainer">
      <select
        id="viewAllButton"
        v-model="selectedTimeframe"
        @change="redirectToAllAchievements"
      >
        <option value="all">View All</option>
        <option value="progress">View Progress</option>
      </select>
    </div>
    <div class="achievements-container">
      <div id="achievementCompletedContainer">
        <h1 id="achievementsCompletedHeader">Achievements Unlocked</h1>
        <div
          id="achievementUnlocked"
          v-for="achievement in completedAchievements"
          :key="achievement.id"
        >
          <img id = "completeImg"
            :src="achievement.icon"
            alt="achievement.title"
            class="achievementCompleted-icon"
          />
          <div class="achievementCompleted-details">
            <h2 class="title">{{ achievement.title }}</h2>
            <p class="subtitle">{{ achievement.description }}</p>
          </div>
          <span class="progressCompleted-text">Challenge Completed</span>
        </div>
      </div>
      <div id="achievementsInProgContainer" class="achievement-tab">
        <h1 id="achievementsInProgHeader">Achievements In-Progress</h1>
        <div
          class="achievement-in-progress"
          v-for="achievement in inProgressAchievements"
          :key="achievement.id"
        >
          <img id = "progImg"
            :src="`grey${achievement.icon}`"
            alt="achievement.title"
            class="achievementinprog-icon"
          />
          <div class="achievement-details">
            <h2 class="greyTitle">{{ achievement.title }}</h2>
            <p class="greySubtitle">{{ achievement.description }}</p>
          </div>
          <div id="progressContainer">
            <span class="inProgress-text"
              >({{ achievement.current }}/{{ achievement.goal }})</span
            >
            <ProgressBar :value="achievement.progress" id="inProgressBar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProgressBar from "@/components/ProgressBar.vue";
import firebase from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "@/components/NavBar.vue";
import SignOutButton from "@/components/SignOutButton.vue";
import { onSnapshot } from "firebase/firestore";

export default {
  components: {
    ProgressBar,
    NavBar,
    SignOutButton,
  },
  data() {
    return {
      userName: "",
      selectedTimeframe: "progress",
      achievements: [
        { //list of achievements
          id: 1,
          title: "Novice User",
          description: "Total EXP Reached 50 XP",
          icon: "useraward.png",
          current: 0,
          goal: 50,
          conditionType: "xp",
        },
        {
          id: 2,
          title: "Master User",
          description: "Total EXP Reached 1000 XP",
          icon: "useraward.png",
          current: 0,
          goal: 1000,
          conditionType: "xp",
        },
        {
          id: 3,
          title: "Legendary User",
          description: "Total EXP Reached 10000 XP",
          icon: "useraward.png",
          current: 0,
          goal: 10000,
          conditionType: "xp",
        },
        {
          id: 4,
          title: "Leaderboard Novice",
          description: "Place Top 3 in Your Monthly Leaderboard Once",
          icon: "leaderaward.png",
          current: 0,
          goal: 1,
          conditionType: "top3",
        },
        {
          id: 5,
          title: "Leaderboard Master",
          description: "Place Top 3 in Your Monthly Leaderboard 5 Times",
          icon: "leaderaward.png",
          current: 0,
          goal: 5,
          conditionType: "top3",
        },
        {
          id: 6,
          title: "Leaderboard Legend",
          description: "Place Top 3 in Your Monthly Leaderboard 10 Times",
          icon: "leaderaward.png",
          current: 0,
          goal: 10,
          conditionType: "top3",
        },
        {
          id: 7,
          title: "Socializer Newbie",
          description: "Add 5 friends",
          icon: "friendicon.png",
          current: 0,
          goal: 5,
          conditionType: "friends",
        },
        {
          id: 8,
          title: "Socializer Master",
          description: "Add 10 friends",
          icon: "friendicon.png",
          current: 0,
          goal: 10,
          conditionType: "friends",
        },
        {
          id: 9,
          title: "Socializer Legend",
          description: "Add 20 friends",
          icon: "friendicon.png",
          current: 0,
          goal: 20,
          conditionType: "friends",
        },
        {
          id: 10,
          title: "Groupstudy Novice",
          description: "Study in Group Session 3 times",
          icon: "studyicon.png",
          current: 0,
          goal: 3,
          conditionType: "groupstudy",
        },
        {
          id: 11,
          title: "Groupstudy Master",
          description: "Study in Group Session 9 times",
          icon: "studyicon.png",
          current: 0,
          goal: 9,
          conditionType: "groupstudy",
        },
        {
          id: 12,
          title: "Groupstudy Legend",
          description: "Study in Group Session 20 times",
          icon: "studyicon.png",
          current: 0,
          goal: 20,
          conditionType: "groupstudy",
        },
      ],
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {     //ensure user is referenced
      if (user) {
        this.userName = user.displayName;
        this.fetchUserProgress();
      } else {
        console.error("No user is logged in. Redirecting to login page.");
        this.$router.push("/login");
      }
    });
  },
  methods: {
    fetchUserProgress() {     //fetches user data from firebase
      if (!this.userName) return;
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(this.userName);
      this.unsubscribe = onSnapshot(
        userRef,
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            const updatedAchievements = this.achievements.map((achievement) => {
              let currentProgress = 0;
              switch (achievement.conditionType) {
                case "xp":
                  currentProgress = userData.xp || 0;
                  break;
                case "top3":
                  currentProgress = userData.top3Placements || 0;
                  break;
                case "friends":
                  currentProgress = userData.friends
                    ? Object.keys(userData.friends).length
                    : 0;
                  break;
                case "groupstudy":
                  currentProgress = userData.groupstudy || 0;
                  break;
              }
              return {
                ...achievement,
                current: currentProgress,
              };
            });
            this.achievements = updatedAchievements;
          } else {
            console.log("No such document!");
          }
        },
        (error) => {
          console.error("Error listening to the document:", error);
        }
      );
    },
    redirectToAllAchievements() { //router to allachievements
      this.$router.push("/allachievements");
    },
    beforeUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    },
  },
  computed: {
    inProgressAchievements() { //filters list of inprogressachievements and ensures progress is in percentage
      return this.achievements
        .filter((achievement) => achievement.current < achievement.goal)
        .map((achievement) => ({
          ...achievement,
          progress: parseFloat(
            ((achievement.current / achievement.goal) * 100).toFixed(1)
          ),
        }));
    },
    completedAchievements() { //filters list of completedachievements and ensures progress is in percentage
      return this.achievements
        .filter((achievement) => achievement.current >= achievement.goal)
        .map((achievement) => ({
          ...achievement,
          progress: parseFloat(
            ((achievement.current / achievement.goal) * 100).toFixed(1)
          ),
        }));
    },
  },
};
</script>
<style>
#progImg{
  margin-left: 20px;
}
#completeImg{
  margin-left: 20px;
}
.achievementPage {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  font-family: "DM Sans", sans-serif;
  background-color: #4d003c;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.signOut {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
}
#myachievementsHeader {
  width: 700px;
  height: 82px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 64px;
  line-height: 82px;
  text-align: center;
  text-transform: capitalize;
  color: #ffffff;
  display: flex;
  margin-left: 35vw;
  margin-right: auto;
  margin-bottom: -5px;
}
#viewAllContainer {
  margin-top: 30px;
  margin-left: auto;
  margin-right: 5vw;
}
#viewAllButton {
  width: 200px;
  height: 33px;
  margin-bottom: 10px;
  background: #ae76a1;
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 31px;
  text-align: center;
  color: #ffffff;
}
#arrowdownimg {
  position: absolute;
  width: 25px;
  height: 17px;
  left: 1445px;
  top: 145px;
  background-size: 25px;
}
#achievementCompletedContainer {
  width: 90vw;
  max-height: 35vh;
  min-height: 20vh;
  margin-left: auto;
  margin-right: auto;
  background: #b857a1;
  border-radius: 10px;
  overflow-y: auto;
  overflow-x: auto;
  margin-bottom: 10px;
}
#achievementsCompletedHeader {
  width: 586px;
  height: 62px;
  text-align: left;
  margin-bottom: -30px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 41px;
  text-transform: capitalize;
  color: #ffffff;
}
#achievementUnlocked {
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 100%;
  background-color: #b857a1;
  box-shadow: none;
  flex-direction: row;
}
.achievementsCompleted-icon {
  width: 100px;
  height: auto;
  margin-right: 20px;
}
.achievementsCompleted-details {
  flex-grow: 20;
  text-align: right;
  flex-direction: column;
}
.title {
  width: 700px;
  height: 53px;
  margin-right: auto;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 41px;
  text-transform: capitalize;
  color: #ffffff;
}
.subtitle {
  margin-top: -40px;
  width: 700px;
  height: 53px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 31px;
  text-transform: capitalize;
  color: #ffffff;
}
.progressCompleted-text {
  margin-left: auto;
  width: 450px;
  height: 39px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 38px;
  text-align: center;
  text-decoration-line: underline;
  text-transform: uppercase;
  color: #11dd11;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
#achievementsInProgContainer {
  width: 90vw;
  height: 40vh;
  max-height: 35vh;
  min-height: 20vh;
  margin-left: auto;
  margin-right: auto;
  background: #cdaec7;
  overflow-y: auto;
  border-radius: 10px;
}
#achievementsInProgHeader {
  height: 62px;
  text-align: left;
  margin-left: 15px;
  margin-bottom: -30px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 41px;
  text-transform: capitalize;
  color: #ffffff;
}
.achievement-in-progress {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: -20px;
}
.achievementinprog-icon {
  width: 100px;
  height: 85px;
  margin-right: 20px;
}
#progressContainer {
  margin-left: auto;
  margin-right: 1vw;
}

#inProgressBar {
  float: right;
  margin-left: 1vw;
}
.greyTitle {
  width: 700px;
  height: 53px;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  text-transform: capitalize;
  color: #474242;
}
.greySubtitle {
  width: 700px;
  height: 53px;
  margin-top: -35px;
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  text-transform: capitalize;
  color: #474242;
}
</style>
