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

    doPostRemove = (post) => {
      this.db.collection("posts").doc(post.id).delete().then(function() {
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

      doRestoreUserPrivileges = (user) => {
        this.db.collection("blacklist").doc(user.id).delete()
        .then(function() {
          console.log("NO BLAAAAAACKLIST");
        })
        .catch(function(error){
          console.error("Error deleting document: ",error);
        });
      }

      stringGen = (len) => {
        var text = "";

        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
      }

      doReport = (post) => {
        this.db.collection("posts").doc(post.id).set({
          comments: post.data().comments,
          content: post.data().content,
          created: post.data().created,
          creator: post.data().creator,
          reported: true
        })
        .then(() => {
          console.log("REPORTED");
        })
        .catch(error => {
          console.error("Error reporting post: ",error);
        });
      }

      doTimeSinceCreation = (timeStamp) => {
        var m = new Date();
        var returnString = "";

        var count = 0;
        var temp = "";

        var year = 0;
        var month = 0;
        var date = 0;

        var hours = 0;
        var minutes = 0;
        var seconds = 0;

        var dateString = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();

        for(var i = 0; i<timeStamp.length; i++){
          if(i+1 === timeStamp.length){
            seconds = temp;
          }
          else if(timeStamp[i] === "/"){
            if(count === 0) year = temp;
            else if(count === 1) month = temp;

            temp = "";
            count++;
          }
          else if(timeStamp[i] === " "){
            date = temp;

            temp = "";
            count++;
          }
          else if(timeStamp[i] === ":"){
            if(count === 3) hours = temp;
            else if(count === 4) minutes = temp;

            temp = "";
            count++;
          }
          else{
            temp += timeStamp[i];
          }
        }

        if(m.getUTCFullYear() - year > 0){
          if(m.getUTCMonth() - month < 0) returnString = ((-1*(m.getUTCMonth() - month)).toString()+" months ago");
          else returnString =  (m.getUTCFullYear() - year).toString()+" years ago";
        }
        else if(m.getUTCMonth() - month > 0){
          if(m.getUTCDate() - date < 0) returnString =  ((-1*(m.getUTCDate - date)).toString()+" days ago");
          else returnString =  ((m.getUTCMonth() - month).toString()+" months ago");
        }
        else if(m.getUTCDate - date > 0){
          if(m.getUTCHours() - hours < 0) returnString = ((m.getUTCHours()+24)-hours).toString+" hours ago";
        }
        else returnString = 0.5;

        console.log("happened: ",returnString);
      }

      doPostComment = (post, comment, uid) => {
        var m = new Date();
        var dateString = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + (m.getUTCHours()+19) + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
        console.log("datestamp: ",dateString);


        var commentId = this.stringGen(21);
        var p_comments = post.data().comments;
        p_comments.push(commentId);

        this.db.collection("comments").doc(commentId)
        .set({
          content: comment,
          pid: post.id,
          uid: uid,
          timestamp: dateString
        })
        .then(function() {
          console.log("POSTED");
        })
        .catch(function(error) {
          console.error("Error adding comment: ",error);
        });

        this.db.collection("posts").doc(post.id)
        .update({
          reported: post.data().reported,
          comments: p_comments
        });
      }

    doUpvote = (postId, userId) => {
      this.db.collection(`posts`).doc(postId).update({
        upvotes: app.firestore.FieldValue.arrayUnion(userId),
        downvotes: app.firestore.FieldValue.arrayRemove(userId),
      }).then(() => {
      }).catch((e) => {
      });
    }

    doDownvote = (postId, userId) => {
      this.db.collection(`posts`).doc(postId).update({
        downvotes: app.firestore.FieldValue.arrayUnion(userId),
        upvotes: app.firestore.FieldValue.arrayRemove(userId),
      }).then(() => {
      }).catch((e) => {
      });
    }

    user = uid => this.db.collection(`users`).doc(uid);
    users = () => this.db.collection(`users`);

    posts = () => this.db.collection(`posts`);
    post = postId => this.db.collection(`posts`).doc(postId);
}

export default Firebase;
