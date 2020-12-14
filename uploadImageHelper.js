$("#upload_progress_bar_profile").hide()


// ********************REPLACE THIS WITH YOUR FIREBASE CONFIGURATIONS START ***********
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
};
// ********************REPLACE THIS WITH YOUR FIREBASE CONFIGURATIONS END *************
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

// This is what makes a website dynamic. It will fetch data from firebase firestore.
// Retrive all the users data and then display them
const db = firebase.firestore()
// documentation: https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection

// When user submit a profile picture the function below will execute. 
// If both image and description exists then it will upload
// it to the firestore and firebase storage
$("#submit_profile_picture").click( function (){

  //Get profile picture that user uploded
  const file = $("#imageUpload").prop("files")[0]
 // console.log("File: " + file)

  if (file == null ) {
    alert("Image cannot be empty.")

  } else { // If both image and description exist.
    const userId = firebase.auth().currentUser.uid
    const db = firebase.firestore();

    const time = new Date()
    const storageRef = firebase.storage().ref() // firestore reference
    const fileName = time.getTime() + "_" + file.name

    const uploadTask = storageRef.child("profilePictures/" + fileName).put(file)
    $("#upload_progress_bar_profile").show()


    // it will first upload the image to Firestorage. (This returns the image url)
    // Then use the image url to update users' profile picture
    // Documentation: https://firebase.google.com/docs/storage/web/upload-files
    uploadTask.on("state_changed",
      function (snapshot) {
        //about upload status
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
        
    
        $("#upload_progress_bar_profile").attr("style", "width:" + percent + "%")
        if (percent == 100){
          $("#upload_progress_bar_profile").html("Successfully Uploded!")
          
        } else{
          $("#upload_progress_bar_profile").html(percent + "%")
        }
        
      },
      function (error) {
        // if error
        alert("Theres an error uploading your image. Error Message:" + error.message)
      }, async function () {
        // if successful

        uploadTask.snapshot.ref.getDownloadURL().then(async function (downloadUrl) {
          // after we have the download url of the picture

          const userProfilePicture = {
            "profilePicture": downloadUrl
          }

          await db.collection('users').doc(userId).update(userProfilePicture).catch(function (error) {
            alert("Error uploading user Data:" + error.message)
            
          });
          // after updating the profile picture only then go to home page
          window.location.href = "home.html"
        })
      }
    )
  }
})