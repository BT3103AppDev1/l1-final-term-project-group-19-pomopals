<script>
import Timer from "/src/components/Timer.vue";
import XpBar from "/src/components/XpBar.vue";
import NavBar from "@/components/NavBar.vue";
import SessionCode from "/src/components/SessionCode.vue";
import SignOutButton from "@/components/SignOutButton.vue";

export default {
  name: "HomePage",
  components: { SignOutButton, XpBar, Timer, NavBar, SessionCode },
  data() {
    return {
      buttonText: "Start!",
    };
  },
  methods: {
    updateNavBar(data) {
      console.log("home page received buttonText from Timer", this.buttonText);
      this.buttonText = data;
    },
  },
};
</script>

<template>
  <div class="home">
    <div><SignOutButton class="signout" /></div>
    <div v-show="buttonText == 'Start!'"><NavBar /></div>
    <div><XpBar /></div>
    <div>
      <Timer @clickOnButtonEvent="updateNavBar" />
    </div>
    <div><SessionCode /></div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
#friendsButton,
#leaderboardButton {
  position: absolute;
  right: 10px;
}

#friendsButton {
  top: 19%;
  transform: translateY(-100%);
}

#leaderboardButton {
  top: 19%;
}

#groupStudy {
  color: black;
  font-size: 500px;
}

.signout {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
}
</style>
