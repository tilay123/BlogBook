$("#upload_progress_bar").hide()

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
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

// TIL: This is what makes a website dynamic. In the code below I am fetching live data from firebase firestore.
// I am retrieving all the users data and then displaying them
const db = firebase.firestore()
// documentation: https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
var htmlCode = ""
db.collection("users")
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //console.log(doc.id, " => ", doc.data().uid);
      htmlCode +=  // making Rudolph's html code dynamically generated
        `
            <div>
                <li class="outerli"><ul class="innerul"> 
                <li><img src="${doc.data().profilePicture || "elk.png"}" height="100" style="border-radius: 50%"></li>
                <li><h3><a href="javascript:goToProfilePage( '${doc.data().uid}')"> ${doc.data().firstName + " " + doc.data().lastName}</a></h3></li>
                <li><b>Bio: </b>${doc.data().bio}</li></ul></li>
            </div>
            `
    });
    $("#listing").html(htmlCode)
  })
  .catch(function (error) {
    console.log("Error getting documents: ", error);
  });

// When user submit a post below function will execute. If both image and description exists then it will upload
// it to the firestore and firebase storage
$("#submit_post_button").click( function (){

  const file = $("#postPic").prop("files")[0]
  const description = $("#postText").val()

  console.log("File: " + file)
  console.log("Desc:"+description)


  if (file == null || !description) {
    alert("Image or description cannot be empty.")

    // return false; // returning false will prevent being reloded
  } else { // If both image and description exist.
    const userId = firebase.auth().currentUser.uid
    const db = firebase.firestore();

    const time = new Date()
    const storageRef = firebase.storage().ref() // firestore reference
    const fileName = time.getTime() + "_" + file.name

    const uploadTask = storageRef.child("blogImages/" + fileName).put(file)
    $("#upload_progress_bar").show()
    // uploading picture to firestorage
    // Documentation: https://firebase.google.com/docs/storage/web/upload-files
    
    uploadTask.on("state_changed",
      function (snapshot) {
        //about upload status
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
        
    
        $("#upload_progress_bar").attr("style", "width:" + percent + "%")
        if (percent == 100){
          $("#upload_progress_bar").html("Successfully Uploded!")
        } else{
          $("#upload_progress_bar").html(percent + "%")
        }
        


      },
      function (error) {
        // if error
        alert("Theres an error uploading your image. Error Message:" + error.message)
      }, async function () {
        // if successful

        uploadTask.snapshot.ref.getDownloadURL().then(async function (downloadUrl) {
          // after we have the download url of the picture
          const blogData = {
            "imageUrl": downloadUrl,
            "description": description,
            "uid": userId,
            "dateUploded": time.toLocaleString()
          }

          await db.collection('blogs').doc(userId).collection('userBlogs').doc().set(blogData).catch(function (error) {
            alert("Error uploading user Data:" + error.message)
            
          });
          // after uploading the post reset the form.
          $("#blogForm")[0].reset()
        })
      }
    )
  }
})

var goToProfilePage = function (userUid){
  console.log(userUid)
// take the user to their profile page

if (userUid == null) {
  userUid = firebase.auth().currentUser.uid
}
  window.location.href = "profile.html?uid=" + userUid

}

