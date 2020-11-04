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
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }


// Til: When a user clicks "Sign In" button, it will check if the email and password entered is valid. If it's not, 
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






