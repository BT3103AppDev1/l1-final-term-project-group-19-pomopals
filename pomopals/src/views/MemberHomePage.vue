<script>
export default {
  name: "MemberHomePage",
  data() {
    return {
      sessionCode: "",
    };
  },
  // hook used to fetch  data  from firebase AFTER this view has been initialised, but hasnt been mouted yet
  created() {
    // Set the sessionCode based on the router query parameter
    this.sessionCode = this.$route.query.sessionCode;
    console.log("Received session code:", this.sessionCode);
  },
  components: {},
  methods: {},
};
</script>

<template>
  <div class="home"></div>
  <div>
    <span id="sessionCode">Session Code: {{ sessionCode }}</span>
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
.sessionCodeContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 20px;
  z-index: 10;
}

.sessionCodeContainer button {
  display: block;
  margin: 5px 0;
  margin-top: 10px;
  width: 200px;
  height: 68px;
  background: white;
  border-radius: 20px;
  font-size: 36px;
  border: none;
  cursor: pointer;
}
</style>
