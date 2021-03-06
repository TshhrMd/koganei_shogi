// Initialize Firebase
var config={
    apiKey: "AIzaSyAJiQumQse-j0rTjtHDEN7gBZFXjmFAsIY",
    authDomain: "koganeishogi.firebaseapp.com",
    projectId: "koganeishogi"
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
var db = firebase.firestore();
db.collection("ProfessionalPlayerEvent").get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    if (doc.exists){
      console.log("Document data:", doc.data());
      data = doc.data();
      console.log("Applicant data:", data['applicant']);
      $('table#mytb tbody').append('<tr><td>'+data['date']+'</td><td>'+data['summary']+'</td><td>'+data['capacity']+'</td><td>'+data['applicant']+'</td></tr>');
    } else {
      console.log("No such document!");
    }
  })
});
