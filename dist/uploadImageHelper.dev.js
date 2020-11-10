"use strict";

$("#upload_progress_bar_profile").hide(); // Initializing Firebase project

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
} // TIL: This is what makes a website dynamic. In the code below I am fetching live data from firebase firestore.
// I am retrieving all the users data and then displaying them


var db = firebase.firestore(); // documentation: https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
// When user submit a post below function will execute. If both image and description exists then it will upload
// it to the firestore and firebase storage

$("#submit_profile_picture").click(function () {
  var file = $("#imageUpload").prop("files")[0];
  console.log("File: " + file);

  if (file == null) {
    alert("Image cannot be empty.");
  } else {
    // If both image and description exist.
    var userId = firebase.auth().currentUser.uid;

    var _db = firebase.firestore();

    var time = new Date();
    var storageRef = firebase.storage().ref(); // firestore reference

    var fileName = time.getTime() + "_" + file.name;
    var uploadTask = storageRef.child("profilePictures/" + fileName).put(file);
    $("#upload_progress_bar_profile").show(); // uploading picture to firestorage
    // Documentation: https://firebase.google.com/docs/storage/web/upload-files

    uploadTask.on("state_changed", function (snapshot) {
      //about upload status
      var percent = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
      $("#upload_progress_bar_profile").attr("style", "width:" + percent + "%");

      if (percent == 100) {
        $("#upload_progress_bar_profile").html("Successfully Uploded!");
      } else {
        $("#upload_progress_bar_profile").html(percent + "%");
      }
    }, function (error) {
      // if error
      alert("Theres an error uploading your image. Error Message:" + error.message);
    }, function _callee2() {
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // if successful
              uploadTask.snapshot.ref.getDownloadURL().then(function _callee(downloadUrl) {
                var userProfilePicture;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // after we have the download url of the picture
                        userProfilePicture = {
                          "profilePicture": downloadUrl
                        };
                        _context.next = 3;
                        return regeneratorRuntime.awrap(_db.collection('users').doc(userId).update(userProfilePicture)["catch"](function (error) {
                          alert("Error uploading user Data:" + error.message);
                        }));

                      case 3:
                        // after updating the profile picture only then go to home page
                        window.location.href = "home.html";

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              });

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
  }
});