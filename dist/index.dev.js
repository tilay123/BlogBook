"use strict";

// // Initializing Firebase project
var firebaseConfig = {
  apiKey: "AIzaSyABOwyUGeAWpwaPro1iPmIJ3A-wGXaiBv0",
  authDomain: "postbook-f5b68.firebaseapp.com",
  databaseURL: "https://postbook-f5b68.firebaseio.com",
  projectId: "postbook-f5b68",
  storageBucket: "postbook-f5b68.appspot.com",
  messagingSenderId: "1075694270728",
  appId: "1:1075694270728:web:89e70eee474b1ffa16d4bd",
  measurementId: "G-LN06ME0J6J"
}; // Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} // When a user clicks "Sign In" button, it will check if the email and password entered is valid. If it's not, 
// then it will show a dialog box with the error message. If it is valid then it will let the user
// go the home page(home.html).
//Documentation: https://firebase.google.com/docs/reference/node/firebase.auth.Auth#signinwithemailandpassword


$("#btn-signIn").click(function () {
  var email = $("#email").val();
  var pass = $("#password").val(); //console.log(email + " " + pass);

  if (email != "" && pass != "") {
    firebase.auth().signInWithEmailAndPassword(email, pass)["catch"](function (error) {
      alert(error.message);
    });
  }
}); // when the user click "sign out" button it will sign out the user.

$("#sign-out-button").click(function () {
  firebase.auth().signOut(); // check caps
}); //Creates a new user account and then updates the NoSQL database with the information that user entered.

$("#btn-signup").click(function _callee(e) {
  var email, pass1, passConfirm, bio, firstName, lastName, userId, createdDate, userData, db;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // extract all data from all all textfield
          email = $("#sign_up_email").val();
          pass1 = $("#sign_up_password").val();
          passConfirm = $("#confirm-password").val();
          bio = $("#sign_up_bio").val();
          firstName = $("#sign_up_firstName").val();
          lastName = $("#sign_up_lastName").val();
          console.log("Sign UP:" + email + " " + pass1 + " " + passConfirm);

          if (!(email != "" && pass1 != "" && passConfirm != "" && bio != "" && firstName != "" && lastName != "")) {
            _context.next = 22;
            break;
          }

          if (!(pass1 == passConfirm)) {
            _context.next = 19;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(firebase.auth().createUserWithEmailAndPassword(email, pass1)["catch"](function (error) {
            alert(error.message);
          }));

        case 11:
          userId = firebase.auth().currentUser.uid;
          createdDate = new Date(); // users data Object. It will soon be used to upload to the database.

          userData = {
            "firstName": firstName,
            "lastName": lastName,
            "bio": bio,
            "createdDate": createdDate.toString(),
            "uid": userId,
            "email": email
          }; // console.log(userId)
          // uploading user data to firstore ***************************************

          db = firebase.firestore(); // save users data that entered by the user to Firestore database.

          _context.next = 17;
          return regeneratorRuntime.awrap(db.collection('users').doc(userId).set(userData).then(function () {})["catch"](function (error) {
            alert("Error uploading user Data:" + error.message);
          }));

        case 17:
          _context.next = 20;
          break;

        case 19:
          alert("Password didn't match");

        case 20:
          _context.next = 23;
          break;

        case 22:
          alert("NO fields can be empty");

        case 23:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Sending password reset email
// if valid email is entered, it will send password reset email. 

$("#send_password_reset_email").click(function (e) {
  var email = $("#password_reset_email").val();

  if (email != "") {
    firebase.auth().sendPasswordResetEmail(email).then(function () {
      alert("Password reset email sent. It may take up to 5 minutes to receive it. Please check your email to verify.");
      window.location.replace("index.html");
    })["catch"](function (error) {
      alert(error.message);
    });
  } else {
    alert("Email field can't be empty");
  }
}); // if a user clicks "Edit Profile" then they will be taken to a unique profile page

var goToEditProfilePage = function goToEditProfilePage() {
  // take the user to their profile page
  var userUid = firebase.auth().currentUser.uid;
  window.location.href = "editProfile.html?uid=" + userUid;
}; // Helper function for editProfile.html
// Update database with new informations that user entered.


$("#btn-saveEdit").click(function _callee2() {
  var db, profileParam, profileUid, firstName, lastName, bio, updatedData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          db = firebase.firestore();
          profileParam = new URLSearchParams(window.location.search);
          profileUid = profileParam.get('uid'); // extract uid from URI

          firstName = $("#firstName_edit_profile").val();
          lastName = $("#lastName_edit_profile").val();
          bio = $("#enterBio").val();

          if (!(firstName.trim() != "" && lastName.trim() != "" && bio.trim() != "")) {
            _context2.next = 13;
            break;
          }

          // users data to be updated
          updatedData = {
            "firstName": firstName,
            "lastName": lastName,
            "bio": bio
          };
          _context2.next = 10;
          return regeneratorRuntime.awrap(db.collection('users').doc(profileUid).update(updatedData).then(function () {})["catch"](function (error) {
            alert("Error updating user Data:" + error.message);
          }));

        case 10:
          window.location.href = "home.html";
          _context2.next = 14;
          break;

        case 13:
          alert("No fields can be empty.");

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});