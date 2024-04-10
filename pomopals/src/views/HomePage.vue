<script>
import Timer from "/src/components/Timer.vue";
import XpBar from "/src/components/XpBar.vue";
import NavBar from "@/components/NavBar.vue";
import SessionCode from "/src/components/SessionCode.vue";

export default {
  name: "HomePage",
  components: { XpBar, Timer, NavBar, SessionCode },
  methods: {
    handleCancelDuration() {
      this.$refs.timerRef.cancelDuration();
    },
  },
};
</script>

<template>
  <div class="home">
    <div><NavBar /></div>
    <div><XpBar /></div>
    <div><Timer ref="timerRef" /></div>
    <div><SessionCode @cancelDurationEvent="handleCancelDuration" /></div>
  </div>
</template>

<style scoped>
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
</style>
