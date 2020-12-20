"use strict";

$("#upload_progress_bar").hide(); // ********************REPLACE THIS WITH YOUR FIREBASE CONFIGURATIONS START ***********
// Initializing Firebase project

var firebaseConfig = {
  apiKey: "AIzaSyABOwyUGeAWpwaPro1iPmIJ3A-wGXaiBv0",
  authDomain: "postbook-f5b68.firebaseapp.com",
  databaseURL: "https://postbook-f5b68.firebaseio.com",
  projectId: "postbook-f5b68",
  storageBucket: "postbook-f5b68.appspot.com",
  messagingSenderId: "1075694270728",
  appId: "1:1075694270728:web:89e70eee474b1ffa16d4bd",
  measurementId: "G-LN06ME0J6J"
}; // ********************REPLACE THIS WITH YOUR FIREBASE CONFIGURATIONS END *************
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} // This is what makes a website dynamic. In the code below I am fetching live data from firebase firestore.
// I am retrieving all the users data and then displaying them


var db = firebase.firestore(); // documentation: https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection

var htmlCode = "";
db.collection("users").get().then(function (querySnapshot) {
  querySnapshot.forEach(function (doc) {
    //console.log(doc.id, " => ", doc.data().uid);'
    //<li><b>Bio: </b>${doc.data().bio}</li></ul></li>   // idk if we need to show bio in home page
    htmlCode += // making Rudolph's html code dynamically generated
    "\n            <div>\n                <li class=\"outerli\"><ul class=\"innerul\"> \n                <li><img src=\"".concat(doc.data().profilePicture || "elk.png", "\" height=\"100\" style=\"border-radius: 50%\"></li>\n                <li><h3><a href=\"javascript:goToProfilePage( '").concat(doc.data().uid, "')\"> ").concat(doc.data().firstName + " " + doc.data().lastName, "</a></h3></li>\n                \n            </div>\n            ");
  });
  $("#listing").html(htmlCode);
})["catch"](function (error) {
  console.log("Error getting documents: ", error);
}); // When user submit a post, the function below will execute. If both image and description exists then it will upload
// it to the firestore and firebase storage

$("#submit_post_button").click(function () {
  var file = $("#postPic").prop("files")[0];
  var description = $("#postText").val();
  console.log("File: " + file);
  console.log("Desc:" + description);

  if (file == null || !description) {
    alert("Image or description cannot be empty."); // return false; // returning false will prevent being reloded
  } else {
    // If both image and description exist.
    var userId = firebase.auth().currentUser.uid;

    var _db = firebase.firestore();

    var time = new Date();
    var storageRef = firebase.storage().ref(); // firestore reference

    var fileName = time.getTime() + "_" + file.name;
    var uploadTask = storageRef.child("blogImages/" + fileName).put(file);
    $("#upload_progress_bar").show(); // uploading picture to firestorage
    // Documentation: https://firebase.google.com/docs/storage/web/upload-files

    uploadTask.on("state_changed", function (snapshot) {
      //about upload status
      // Update progress bar when image upload percentage changed.
      var percent = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
      $("#upload_progress_bar").attr("style", "width:" + percent + "%");

      if (percent == 100) {
        $("#upload_progress_bar").html("Successfully Uploded!");
      } else {
        $("#upload_progress_bar").html(percent + "%");
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
                var blogData;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // after we have the download url of the picture we will save the save to Firestore database.
                        blogData = {
                          "imageUrl": downloadUrl,
                          "description": description,
                          "uid": userId,
                          "dateUploded": time.toLocaleString()
                        };
                        _context.next = 3;
                        return regeneratorRuntime.awrap(_db.collection('blogs').doc(userId).collection('userBlogs').doc().set(blogData)["catch"](function (error) {
                          alert("Error uploading user Data:" + error.message);
                        }));

                      case 3:
                        // after uploading the post reset the form.
                        $("#blogForm")[0].reset();

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

var goToProfilePage = function goToProfilePage(userUid) {
  console.log(userUid); // take the user to their profile page

  if (userUid == null) {
    userUid = firebase.auth().currentUser.uid;
  }

  window.location.href = "profile.html?uid=" + userUid;
};