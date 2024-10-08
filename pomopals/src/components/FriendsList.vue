<template>
  <div class="friends-list">
    <div class="list-header">
      <span>Username</span>
    </div>
    <ul>
      <li v-for="friend in filteredFriends" :key="friend">
        <span>{{ friend }}</span>
        <button class="delete-button" @click="deleteFriend(friend)">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from "@/firebase";

export default {
  name: "FriendsList",

  data() {
    return {
      friendsMap: {},
      isLoading: true,
      error: null,
      currentUser: null, // Store the currentUser in data
      username: null,
    };
  },
  watch: {
    // Watch the username for changes and fetch friends when it is set
    username(newVal) {
      if (newVal) {
        this.fetchFriends(newVal);
      }
    },
  },
  mounted() {
    this.isLoading = true;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.username = user.displayName;
        console.log("Authenticated username:", this.username);
      } else {
        this.currentUser = null;
        this.username = null;
        this.isLoading = false;
        console.log("No user is logged in");
      }
    });
  },
  props: {
    searchQuery: String,
  },
  computed: {
    filteredFriends() {
      const query = this.searchQuery.toLowerCase();
      return Object.keys(this.friendsMap).filter((friend) =>
        friend.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    fetchFriends(username) {
      const db = firebase.firestore();
      db.collection("users")
        .doc(username)
        .onSnapshot(
          (doc) => {
            if (doc.exists && doc.data().friends) {
              this.friendsMap = doc.data().friends;
            } else {
              this.friendsMap = {};
            }
            this.isLoading = false;
          },
          (error) => {
            console.error("Error fetching friends:", error);
            this.isLoading = false;
          }
        );
    },
    deleteFriend(friend) {
      const confirmed = window.confirm(`Are you sure you want to delete ${friend} as a friend?`);
    if (!confirmed) {
        return; // Do nothing if the user cancels the action
    }
      const db = firebase.firestore();

      if (this.currentUser) {
        const username = this.username;
        const currentUserRef = db.collection("users").doc(username);
        const friendRef = db.collection("users").doc(friend);

        // Start a batch
        const batch = db.batch();

        // Remove the friend from the current user's friends map
        batch.update(currentUserRef, {
          [`friends.${friend}`]: firebase.firestore.FieldValue.delete(),
        });

        // Remove the current user from the friend's friends map
        batch.update(friendRef, {
          [`friends.${username}`]: firebase.firestore.FieldValue.delete(),
        });

        // Commit the batch
        batch
          .commit()
          .then(() => {
            // If the Firestore operation is successful, update the local state
            const updatedFriendsMap = { ...this.friendsMap };
            delete updatedFriendsMap[friend];
            this.friendsMap = updatedFriendsMap;
            // Optionally, emit an event or call a method to refresh the friend list in the parent component if necessary
          })
          .catch((error) => {
            console.error("Error removing friend:", error);
            // Handle the error appropriately
          });
      } else {
        // Handle the case where there is no current user logged in
        console.log("No user logged in");
      }
    },
  },
};
</script>

<style scoped>
.friends-list {
  background: white;
  color: black;
  margin: 0 auto;
  width: 80%;
  max-width: 800px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
  background: black;
  color: aliceblue;
  padding: 10px;
  border-bottom: 1px solid #cccccc;
  text-align: left;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

ul li {
  padding: 10px;
  border-bottom: 1px solid #cccccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-button {
  background-color: #c20606;
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;

  padding: 5px 10px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #960c0c;
}
</style>
