<template>
    <div class="navbar">
        <div>Leaderboard</div>
        <button>Sign Out</button>
    </div>
    
    <div class="timeframe-selector">
        <select id="timeframe-dropdown" onchange="changeTimeframe(this.value)">
            <option value="all">All Time</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
        </select>
    </div>

    <div class="leaderboard-container">
        <div class="table-header">
            <div style="flex: 1.15;">Rank</div>
            <div style="flex: 0.75; text-align: left;">Username</div>
            <div style="flex: 2; text-align: right;">Points</div>
        </div>
        <div class="leaderboard-item" v-for="(item, index) in leaderboardItems" :key="index" style="display: flex;">
            <div>
                <span class="rank-medal">{{ item.medal }}</span>
            </div>
        <div class="leaderboard-username">{{ item.username }}</div>
        <button v-if="item.showButton" class="add-friend-btn" :class="{ added: item.added }" @click="toggleAdd(item, index)">{{ item.added ? 'Added' : '+ Add Friend' }}</button>
        <div class="leaderboard-points">{{ item.points }}</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'LeaderboardPage',
  data() {
    return {
      leaderboardItems: [
        { username: 'Josh123', points: 1793, medal: '🥇', showButton: false, added: true },
        { username: 'elli065', points: 1652, medal: '🥈', showButton: true, added: false },
        { username: 'johnappleseed', points: 1574, medal: '🥉', showButton: false, added: true },
        { username: 'YourUsername (You)', points: 1502, medal: '4', showButton: false, added: false },
        { username: 'imthebest01', points: 1496, medal: '5', showButton: true, added: false },
        { username: 'tricia!', points: 1493, medal: '6', showButton: true, added: false },
        { username: 'studying567', points: 1421, medal: '7', showButton: true, added: false },
        { username: 'eddie', points: 1400, medal: '8', showButton: true, added: false },
        { username: 'ilove2study462', points: 1357, medal: '9', showButton: true, added: false },
        { username: 'penelope', points: 1244, medal: '10', showButton: true, added: false }
      ]
    };
  },
  methods: {
    toggleAdd(item, index) {
      this.leaderboardItems[index].added = !this.leaderboardItems[index].added;
    },
    changeTimeframe(timeframe) {
      console.log(timeframe + ' leaderboard selected');
      // Implement logic to change the leaderboard based on the selected timeframe
    }
  }
}
</script>

<style>
    body {
        margin: 0;
        background-color: #471237;
        font-family: 'Calibri', sans-serif;
    }

    .navbar {
        position: relative; 
        display: flex;
        justify-content: center; 
        align-items: center; 
        width: 100%; 
        padding: 30px 0;
        font-size: 50px; 
        color: white;
    }

    .navbar > div {
        font-weight: bold; /* Make "Leaderboard" text bold */
    }

    .navbar h1 {
        font-weight: 500;
        margin: 0;
    }

    .navbar button {
        position: absolute; /* Absolute positioning to place it on the right */
        top: 20px; /* Position from the top of the navbar */
        right: 20px; /* Position from the right side of the page */
        padding: 10px 20px; /* Padding to make the button larger */
        background-color: #000; /* Background color for the button */
        color: white;
        border: none; /* No border for the button */
        border-radius: 4px; /* Slightly rounded corners for the button */
        cursor: pointer; /* Changes the cursor to the pointer when hovering over the button */
        font-size: 18px; /* Sets the font size for the text inside the button */
    }
    
    .leaderboard-container {
        width: 70%;
        margin: 30px auto 0 auto; /* Adjusted for auto margins and spacing */
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 10px; /* Added border-radius */
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        background-color: black; /* This will make the background of the header black */
        padding: 10px;
        color: white; /* This will make the text color white */
    }

    .table-header > div:nth-child(1), .leaderboard-item > div:nth-child(1) {
    flex: 0 0 50px; /* Rank */
    }

    .leaderboard-container .table-header div {
        font-weight: bold; /* Makes the font bold */
    }

    .leaderboard-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        padding: 10px 20px;
    }
    
    .leaderboard-table {
        width: 100%; /* Use 100% instead of 70% to fill the container */
        border-collapse: collapse;
        background-color: #000;
    }

    .leaderboard-table th, .leaderboard-table td {
        padding: 10px 20px;
        text-align: left;
    }

    .leaderboard-table th {
        background-color: #000; /* Black header background */
        color: white;
    }

    .leaderboard-table tr:nth-child(even) {
        background-color: #f3e5f5; /* Zebra striping for rows */
    }


    .leaderboard-table td {
        border-bottom: 1px solid #e0e0e0;
    }

    .timeframe-selector {
        text-align: center; /* Center the timeframe dropdown */
        margin-top: 20px; /* Add some space above the selector */
    }
    
    .timeframe-selector select {
        padding: 10px;
        background-color: #000;
        color: white;
        cursor: pointer;
        font-size: 16px;
    }

    .timeframe-selector select:focus {
        outline: none;
    }

    .add-friend-btn {
        /* Button styles have been adjusted to match the image */
        background-color: #55bc47; /* Lighter purple background */
        border: none;
        border-radius: 20px;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 10px 20px;
        margin-left: 10px; /* Ensures spacing from the username */
        display: inline-block;
    }

    .add-friend-btn:hover {
        background-color: #7927b0;
    }

    .add-friend-btn.added {
        background-color: #a067b8;
    }

    .add-friend-placeholder {
    flex: 0 0 150px; /* Adjust width to match the "Add Friend" button's width */
    }

    .rank-medal {
        height: 100px;
        width: 100px;
        font-size: 1.75em;
    }

    .username-highlight {
        background-color: #EDE7F6;
        border-radius: 20px;
        display: inline-block;
        padding: 5px 15px;
    }
</style>
