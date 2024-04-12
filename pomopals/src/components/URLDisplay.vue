<template>
  <table id="blocklist"></table>
</template>
<script>
import firebase from "@/firebase";
import { toDisplayString } from "vue";
export default {
  Name: "Blocklist",
  methods: {
    async display() {
      let index = 1;
      const db = firebase.firestore();
      let allDocuments = await getDocs(collection(db, "urls"));
    },
  },
};
</script>
