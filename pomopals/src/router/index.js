import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/views/LandingPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignUpPage from "@/views/SignUpPage.vue";
import HomePage from "@/views/HomePage.vue";
import FriendsPage from "@/views/FriendsPage.vue";
import LeaderboardPage from "@/views/LeaderboardPage.vue";
import FriendsLeaderboardPage from "@/views/FriendsLeaderboardPage.vue";
import URLBlockerPage from "@/views/URLBlockerPage.vue";
import AchievementPage from "@/views/Achievements.vue";
import AllAchievementPage from "@/views/AllAchievements.vue";
import HostHomePage from "@/views/HostHomePage.vue";
import MemberHomePage from "@/views/MemberHomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: LandingPage,
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage,
    },
    {
      path: "/signup",
      name: "SignUpPage",
      component: SignUpPage,
    },
    {
      path: "/home",
      name: "HomePage",
      component: HomePage,
    },
    {
      path: "/host",
      name: "HostHomePage",
      component: HostHomePage,
    },
    {
      path: "/member",
      name: "MemberHomePage",
      component: MemberHomePage,
    },
    {
      path: "/friends",
      name: "FriendsPage",
      component: FriendsPage,
    },
    {
      path: "/leaderboard",
      name: "LeaderboardPage",
      component: LeaderboardPage,
    },
    {
      path: "/friendsleaderboard",
      name: "FriendsLeaderboardPage",
      component: FriendsLeaderboardPage,
    },
    {
      path: "/urlblocker",
      name: "URLBlockerPage",
      component: URLBlockerPage,
    },
    {
      path: "/achievements",
      name: "AchievementPage",
      component: AchievementPage,
    },
    {
      path: "/allachievements",
      name: "AllAchievementPage",
      component: AllAchievementPage,
    },
  ],
});

export default router;
