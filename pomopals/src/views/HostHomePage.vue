<script>
import Timer from "/src/components/Timer.vue";
import XpBar from "/src/components/XpBar.vue";
import NavBar from "@/components/NavBar.vue";
import SessionCode from "@/components/SessionCode.vue";

export default {
  name: "HostHomePage",
  components: { XpBar, Timer, NavBar, SessionCode },
  data() {
    return {
      sessionCode: "",
    };
  },
  methods: {
    handleDisplaySessionCode(code) {
      this.sessionCode = code;
    },
  },
};
</script>

<template>
  <div class="home">
    <div><NavBar /></div>
    <div>
      <SessionCode
        v-if="false"
        @displaySessionCode="handleDisplaySessionCode"
      />
    </div>
    <div><XpBar /></div>
    <div><Timer ref="timerRef" /></div>
    <p1 id="groupStudy">
      {{ sessionCode }}
    </p1>
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
  font-size: 500px;
}
</style>
