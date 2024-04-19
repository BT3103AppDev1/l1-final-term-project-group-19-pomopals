<script>
import Timer from "/src/components/Timer.vue";
import XpBar from "/src/components/XpBar.vue";
import NavBar from "@/components/NavBar.vue";
import SessionCode from "/src/components/SessionCode.vue";

export default {
  name: "HomePage",
  components: { XpBar, Timer, NavBar, SessionCode },
  methods: {},
};
</script>

<template>
  <div class="home">
    <div><NavBar /></div>
    <div><XpBar /></div>
    <div><Timer /></div>
    <div><SessionCode /></div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  font-family: "DM Sans", sans-serif;
  background-image: url("/bg.jpeg");
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
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
</style>
