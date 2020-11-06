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

  // TIL: This is what makes a website dynamic. In the code below I am fetching live data from firebase firestore.
  // I am retrieving all the users data and then displaying them
  const db = firebase.firestore()
// documentation: https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
var htmlCode = ""
db.collection("users")
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          //console.log(doc.id, " => ", doc.data());
            htmlCode +=  // making Rudolph's html code dynamically generated
            `
            <div>
                <li class="outerli"><ul class="innerul"> 
                <li><h3>${doc.data().firstName + " " + doc.data().lastName}</h3></li>
                <li><img src="elk.png"></li>
                <li><b>Bio: </b>${doc.data().bio}</li></ul></li>
            </div>
            `
      });
      $("#listing").html(htmlCode)
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
