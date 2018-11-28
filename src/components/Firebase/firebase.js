import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyA6WokB6mgmPp-j9EjFf5hgPuTyNcWS5Fg",
    authDomain: "turf-webapps.firebaseapp.com",
    databaseURL: "https://turf-webapps.firebaseio.com",
    projectId: "turf-webapps",
    storageBucket: "",
    messagingSenderId: "558644909362"
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();
        // Disable deprecated features
        this.db.settings({
          timestampsInSnapshots: true
        });
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    doCreateUserRole = (email) => {
      this.db.collection("users").add({
        email: email,
        role: ['user']
      }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }

    user = uid => this.db.collection(`users`).doc(uid);
    users = () => this.db.collection(`users`);

    posts = () => this.db.collection(`posts`);
}

export default Firebase;
