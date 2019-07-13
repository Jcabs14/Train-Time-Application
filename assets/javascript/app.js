// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve current trains from the train database.
// 4. Create a way to calculate the time till next train and minutes away. Using difference between start and current time.
//    Then use moment.js formatting to set difference in time
// 5. Calculate the time away

// 1. Initialize Firebase

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyATbXB5XZE9hiJvRKZl-MN_0gJDGINqMDo",
    authDomain: "jared-train-project.firebaseapp.com",
    databaseURL: "https://jared-train-project.firebaseio.com",
    projectId: "jared-train-project",
    storageBucket: "",
    messagingSenderId: "933592454842",
    appId: "1:933592454842:web:ae8bce9a7a13248d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//var to get current time

var timeNow = moment();

// 2. Create button to add trains then update the html + update the database


$('#add-train-btn').on('click', function(event){
event.preventDefault();



//grab user input
var trainName = $('#train-name-input').val().trim();
var trainDestination = $('#destination-input').val().trim();
var firstTrain = $('#first-train-input').val().trim();
var trainFrequency = $('#frequency-input').val().trim();

//convert first train
//minus 1 year to make sure it is before the current time
var firstTrainConvert = moment(firstTrain, "hh:mm").subtract("1, years");

//compare the current time from the first time the train left
var difference = timeNow.diff(moment(firstTrainConvert), "minutes");

var remainder = difference % trainFrequency;

//get mins for next train
var minsTillNext = trainFrequency - remainder;
var nextTrain = moment().add(minsTillNext, "minutes").format("hh:mm a");




//create new train object
var newTrain = {
    name:trainName,
    destination:trainDestination,
    first:firstTrain,
    frequency:trainFrequency,
    next:nextTrain,
    mins:minsTillNext
};

database.ref().push(newTrain);

//clear input fileds
$('#train-name-input').val('');
$('#destination-input').val('');
$('#first-train-input').val('');
$('#frequency-input').val('');
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;
    var mins = childSnapshot.val().mins;
    var next = childSnapshot.val().next;
    

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(next),
      $("<td>").text(mins)
    );
  
    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
  });