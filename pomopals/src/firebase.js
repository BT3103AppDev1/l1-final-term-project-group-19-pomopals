// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsihCLzjbHfADjHc001JPQKplJRvCmY6k",
    authDomain: "pomopals-f1da7.firebaseapp.com",
    projectId: "pomopals-f1da7",
    storageBucket: "pomopals-f1da7.appspot.com",
    messagingSenderId: "349723901190",
    appId: "1:349723901190:web:d02c104ed0c82a4229b287"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;