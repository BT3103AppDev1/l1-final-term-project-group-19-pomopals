<script>
import Timer from "/src/components/Timer.vue";
import XpBar from "/src/components/XpBar.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "HostHomePage",
  components: { XpBar, Timer, NavBar },
  methods: {},
};
</script>

<template>
  <div class="home">
    <div><NavBar /></div>
    <div>
      <h1 id="groupStudy">
        <bold> YOU ARE THE HOST OF THE STUDY SESSION </bold>
      </h1>
    </div>
    <div><XpBar /></div>
    <div><Timer ref="timerRef" /></div>
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

#groupStudy {
  color: black;
  font-size: 100px;
}
</style>
