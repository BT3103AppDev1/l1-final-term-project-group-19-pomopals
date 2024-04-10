<template>
  <div class="sessionCodeContainer">
    <div v-if="viewState == 'start'">
      <button @click="setViewState('host')">Host</button>
      <button @click="setViewState('join')">Join</button>
    </div>
    <div v-if="viewState == 'host'">
      <button id="generateButton" @click="generateCode">
        Generate Session Code
      </button>
      <input type="text" v-model="sessionCode" readonly />
      <button @click="setViewState('start')">Back</button>
    </div>
    <div v-if="viewState == 'join'">
      <input type="text" v-model="inputCode" placeholder="Input Group Code" />
      <button @click="enterCode">Enter</button>
      <button @click="setViewState('start')">Back</button>
    </div>
  </div>
</template>

<script>
import { firebaseAuth, firestore } from "../firebase.js";

export default {
  name: "SessionCode",
  data() {
    return {
      sessionCode: "",
      inputCode: "",
      viewState: "start",
    };
  },
  methods: {
    generateCode() {
      this.sessionCode =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      this.$emit("cancelDurationEvent");
    },
    enterCode() {
      alert("Joined Group Study Session");
      this.viewState = "start";
    },
    setViewState(state) {
      this.viewState = state;
      this.sessionCode = "";
    },
  },
};
</script>

<style scoped>
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

#generateButton {
  font-size: 25px;
}

input[type="text"] {
  margin-top: 10px; /* Additional margin for text inputs */
}
</style>
