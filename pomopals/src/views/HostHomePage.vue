<template>
  <div>
    <span id="sessionCode">Session Code: {{ sessionCode }}</span>
  </div>
  <div class="home">
    <SignOutButton />
    <XpBar />
    <Timer ref="timerRef" />
  </div>
</template>

<script>
import SignOutButton from "@/components/SignOutButton.vue";
import Timer from "/src/components/Timer.vue";
import XpBar from "/src/components/XpBar.vue";

export default {
  name: "HostHomePage",
  components: {
    SignOutButton,
    Timer,
    XpBar,
  },
  data() {
    return {
      sessionCode: "",
    };
  },
  created() {
    // Set the sessionCode based on the router query parameter
    this.sessionCode = this.$route.query.sessionCode;
    console.log("Received session code:", this.sessionCode);
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

#sessionCode {
  left: auto;
  right: auto;
  top: 0px;
  position: absolute;
  margin-top: 20px; /* Add more space above the session code display */
  font-size: 24px;
  color: white;
  font-weight: 700;
  font: "lucida sans";
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
</style>
