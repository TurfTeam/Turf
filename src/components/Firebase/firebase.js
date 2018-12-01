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

    doSignOut = () => {
      this.auth.signOut();
      ;localStorage.setItem('r', JSON.stringify(0));
    }

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    doCreateUserRole = (uid, email) => {
      this.user(uid).set({
        email: email,
        role: ['user']
      }).then(function(docRef) {
        localStorage.setItem('r', JSON.stringify(1));
        //console.log("Document written with ID: ", docRef.id);
      })
    }
    doGetUserRole = (email) => {
      this.db.collection("users").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          localStorage.setItem('r', JSON.stringify(doc.data().role.length));
          console.log("THIS THE ROLE: ",localStorage.getItem('r'));
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    }

    doPostRemove = (postId) => {
      this.db.collection("posts").doc(postId).delete().then(function() {
        console.log("Post successfully deleted.");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
    }

      doBlackListUser = (user) => {
        this.db.collection("blacklist").doc(user.id).set({
          email: user.data().email,
          role: user.data().role
        })
        .then(function() {
          console.log("BLAAAAACKLIST");
        })
        .catch(function(error){
          console.error("Error writing document: ",error);
        });
      }

    user = uid => this.db.collection(`users`).doc(uid);
    users = () => this.db.collection(`users`);

    posts = () => this.db.collection(`posts`);
}

export default Firebase;
