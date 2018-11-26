import app from 'firebase/app';
import 'firebase/auth';

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
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);
}

export default Firebase;
