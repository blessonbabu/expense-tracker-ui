import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBaD95ka4rO6XdV4e8OXnKqIb71LR6uscQ",
    authDomain: "expense-tracker-6027d.firebaseapp.com",
    databaseURL: "https://expense-tracker-6027d.firebaseio.com",
    projectId: "expense-tracker-6027d",
    storageBucket: "expense-tracker-6027d.appspot.com",
    messagingSenderId: "163586158667"
};

firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth

