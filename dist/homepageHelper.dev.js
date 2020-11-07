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
} // TIL: This is what makes a website dynamic. In the code below I am fetching live data from firebase firestore.
// I am retrieving all the users data and then displaying them


var db = firebase.firestore(); // documentation: https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection

var htmlCode = "";
db.collection("users").get().then(function (querySnapshot) {
  querySnapshot.forEach(function (doc) {
    //console.log(doc.id, " => ", doc.data());
    htmlCode += // making Rudolph's html code dynamically generated
    "\n            <div>\n                <li class=\"outerli\"><ul class=\"innerul\"> \n                <li><h3>".concat(doc.data().firstName + " " + doc.data().lastName, "</h3></li>\n                <li><img src=\"elk.png\"></li>\n                <li><b>Bio: </b>").concat(doc.data().bio, "</li></ul></li>\n            </div>\n            ");
  });
  $("#listing").html(htmlCode);
})["catch"](function (error) {
  console.log("Error getting documents: ", error);
}); // When user submit a post below function will execute. If both image and description exists then it will upload
// it to the firestore and firebase storage

$("#submit_post_button").click(function _callee2() {
  var file, description, userId, _db, time, storageRef, fileName, uploadTask;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          file = $("#postPic").prop("files")[0];
          description = $("#postText").val();

          if (file == null || !description) {
            alert("Image or description cannot be empty.");
          } else {
            // If both image and description exist.
            userId = firebase.auth().currentUser.uid;
            _db = firebase.firestore();
            time = new Date();
            storageRef = firebase.storage().ref(); // firestore reference

            fileName = time.getTime() + "_" + file.name;
            uploadTask = storageRef.child("blogImages/" + fileName).put(file); // uploading picture to firestorage
            // Documentation: https://firebase.google.com/docs/storage/web/upload-files

            uploadTask.on("state_changed", function (snapshot) {//about upload status
            }, function (error) {
              // if error
              alert("Theres an error uploading your image. Error Message:" + error.message);
            }, function () {
              // if successful
              uploadTask.snapshot.ref.getDownloadURL().then(function _callee(downloadUrl) {
                var blogData;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // after we have the download url of the picture
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
            });
          }

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});