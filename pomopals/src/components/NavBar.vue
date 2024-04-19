<template>
  <div class="navbar">
    <nav>
      <router-link to="/home" class="nav-btn" id="home" active-class="active">
        <img src="@/assets/home_empty.png" width="30" class="default" />
        <img
          src="@/assets/home_filled.png"
          width="30"
          class="filled"
        /> </router-link
      ><br />
      <router-link
        to="/leaderboard"
        class="nav-btn"
        id="leaderboard"
        active-class="active"
      >
        <img src="@/assets/leaderboard_empty.png" width="30" class="default" />
        <img
          src="@/assets/leaderboard_filled.png"
          width="30"
          class="filled"
        /> </router-link
      ><br />
      <router-link
        to="/friends"
        class="nav-btn"
        id="friends"
        active-class="active"
      >
        <img src="@/assets/friends_empty.png" width="30" class="default" />
        <img
          src="@/assets/friends_filled.png"
          width="30"
          class="filled"
        /> </router-link
      ><br />
      <router-link
        to="/achievements"
        class="nav-btn"
        id="achievements"
        :class="{ active: isAchievementsActive }"
      >
        <img
          v-if="isAchievementsActive"
          src="@/assets/achievements_filled.png"
          width="30"
        />
        <img
          v-else
          src="@/assets/achievements_empty.png"
          width="30"
        /> </router-link
      ><br />
      <router-link
        to="/urlblocker"
        class="nav-btn"
        id="url"
        active-class="active"
      >
        <img src="@/assets/url_empty.png" width="30" class="default" />
        <img src="@/assets/url_filled.png" width="30" class="filled" />
      </router-link>
    </nav>
  </div>
</template>
<script>
export default {
  name: "Nav",
  computed: {
    isAchievementsActive() {
      // Check if the current route is '/achievements' or starts with '/achievements/'
      return (
        this.$route.path === "/achievements" ||
        this.$route.path === "/allachievements"
      );
    },
  },
};
</script>
<style>
.navbar {
  height: 100%; /* 100% Full-height */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 200px;
  padding-left: 20px;
}
.nav-btn {
  background-color: transparent;
}
/* make the icons change when u hover */
#home:hover img {
  content: url("@/assets/home_filled.png");
}
#leaderboard:hover img {
  content: url("@/assets/leaderboard_filled.png");
}
#friends:hover img {
  content: url("@/assets/friends_filled.png");
}
#achievements:hover img {
  content: url("@/assets/achievements_filled.png");
}
#url:hover img {
  content: url("@/assets/url_filled.png");
}
/* Default icon */
.nav-btn img {
  display: block;
}

/* Filled icon (hidden by default) */
.nav-btn img.filled {
  display: none;
}

/* Swap icons when active */
.active img.default {
  display: none;
}

.active img.filled {
  display: block;
}
</style>
