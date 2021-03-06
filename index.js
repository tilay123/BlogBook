
// ********************REPLACE THIS WITH YOUR FIREBASE CONFIGURATIONS START ***********
// // Initializing Firebase project
var firebaseConfig = {
  apiKey: "AIzaSyABOwyUGeAWpwaPro1iPmIJ3A-wGXaiBv0",
  authDomain: "postbook-f5b68.firebaseapp.com",
  
  projectId: "postbook-f5b68",
  storageBucket: "postbook-f5b68.appspot.com",
  messagingSenderId: "1075694270728",
  appId: "1:1075694270728:web:89e70eee474b1ffa16d4bd",
  measurementId: "G-LN06ME0J6J"
};
/* Follow these instructions to get this web application to work:
  1. Create a Firebase project
  2. Add a web app from Firebase homepage then replace only the firebaseConfig (We took care of other things)
  3. Get Started with Authentication then enable "Email/Password"
  4. Get started with Cloud Firestore (Start in test mode so that you don't have to worry about security rules)
  5. Follow README.md instructions to run this application
 
// ********************REPLACE THIS WITH YOUR FIREBASE CONFIGURATIONS END *************
*/
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

// When a user clicks "Sign In" button, it will check if the email and password entered is valid. If it's not, 
// then it will show a dialog box with the error message. If it is valid then it will let the user
// go the home page(home.html).
//Documentation: https://firebase.google.com/docs/reference/node/firebase.auth.Auth#signinwithemailandpassword
$("#btn-signIn").click(function () {
  var email = $("#email").val();
  var pass = $("#password").val();
  //console.log(email + " " + pass);

  if (email != "" && pass != "") {
    firebase.auth().signInWithEmailAndPassword(email, pass).catch((error) => {
      alert(error.message);
    });
  }
});

// when the user click "sign out" button it will sign out the user.
$("#sign-out-button").click(function () {
  firebase.auth().signOut(); // check caps

});

//Creates a new user account and then updates the NoSQL database with the information that user entered.
$("#btn-signup").click(async function (e) {

  // extract all data from all all textfield
  const email = $("#sign_up_email").val()
  const pass1 = $("#sign_up_password").val()
  const passConfirm = $("#confirm-password").val()
  const bio = $("#sign_up_bio").val()
  const firstName = $("#sign_up_firstName").val()
  const lastName = $("#sign_up_lastName").val()

  console.log("Sign UP:" + email + " " + pass1 + " " + passConfirm);

  if (email != "" && pass1 != "" && passConfirm != "" && bio != "" && firstName != "" && lastName != "") {

    if (pass1 == passConfirm) {
      await firebase.auth().createUserWithEmailAndPassword(email, pass1).catch((error) => {
        alert(error.message);
      });

      const userId = firebase.auth().currentUser.uid


      const createdDate = new Date();

      // users data Object. It will soon be used to upload to the database.
      const userData = {
        "firstName": firstName,
        "lastName": lastName,
        "bio": bio,
        "createdDate": createdDate.toString(),
        "uid": userId,
        "email": email
      }

      // console.log(userId)
      // uploading user data to firstore ***************************************
      const db = firebase.firestore();


      // save users data that entered by the user to Firestore database.
      await db.collection('users').doc(userId).set(userData).then(function () { }).catch(function (error) {
        alert("Error uploading user Data:" + error.message)
      });

      // uploading it to firstore END***************************************

    } else {
      alert("Password didn't match")
    }

  } else {
    alert("NO fields can be empty")
  }
});

// Sending password reset email

// if valid email is entered, it will send password reset email. 
$("#send_password_reset_email").click(function (e) {

  const email = $("#password_reset_email").val()

  if (email != "") {
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      alert("Password reset email sent. It may take up to 5 minutes to receive it. Please check your email to verify.")
      window.location.replace("index.html")
    }).catch(function (error) {
      alert(error.message)
    })
  } else {
    alert("Email field can't be empty")
  }
});

// if a user clicks "Edit Profile" then they will be taken to a unique profile page
var goToEditProfilePage = function () {
  // take the user to their profile page
  const userUid = firebase.auth().currentUser.uid
  window.location.href = "editProfile.html?uid=" + userUid

}

// Helper function for editProfile.html
// Update database with new informations that user entered.
$("#btn-saveEdit").click(async function () {

  const db = firebase.firestore();
  const profileParam = new URLSearchParams(window.location.search);
  const profileUid = profileParam.get('uid');// extract uid from URI

  const firstName = $("#firstName_edit_profile").val()
  const lastName = $("#lastName_edit_profile").val()
  const bio = $("#enterBio").val()

  if (firstName.trim() != "" && lastName.trim() != "" && bio.trim() != "") {


    // users data to be updated
    const updatedData = {
      "firstName": firstName,
      "lastName": lastName,
      "bio": bio
    }

    await db.collection('users').doc(profileUid).update(updatedData).then(function () { }).catch(function (error) {
      alert("Error updating user Data:" + error.message)
    });

    window.location.href = "home.html"


  } else {
    alert("No fields can be empty.")
  }


});