import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFEMNjjx75Q3E9KcnLNnwHyjNfsGll1QA",
  authDomain: "gameppt-5a53e.firebaseapp.com",
  databaseURL: "https://gameppt-5a53e-default-rtdb.firebaseio.com",
  projectId: "gameppt-5a53e",
  storageBucket: "gameppt-5a53e.firebasestorage.app",
  messagingSenderId: "436392226432",
  appId: "1:436392226432:web:190c78b73aa2d32d520065",
  measurementId: "G-CQBG1NRXN7"
};

firebase.initializeApp(firebaseConfig);

const rtdb = firebase.database(); // inicializamos la base de datos

export { rtdb };
