$(document).ready(function() {

    // define variables


    // Initialize Firebase
      // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDog_U2J_D3IJCPUWJzmGKWruvhNdLKFDY",
    authDomain: "trainschedule-691e4.firebaseapp.com",
    databaseURL: "https://trainschedule-691e4.firebaseio.com",
    projectId: "trainschedule-691e4",
    storageBucket: "trainschedule-691e4.appspot.com",
    messagingSenderId: "459047737726"
  };
  firebase.initializeApp(config);


  // Create a variable to reference the database.
  var database = firebase.database();

  $(document).on("click", "#sbmitbutt", function(){
        event.preventDefault();
        //read the fields
        var trainName = $('#trainNameInput').val().trim();
        var destination = $('#destinationInput').val().trim();
        var firstTrainTime = $('#firstTrainTimeInput').val().trim();
        var frequency = $('#frequencyInput').val().trim();

        //submit to database
        // Code for handling the push
        database.ref().push({
            TrainName: trainName,
            Destination: destination,
            TrainStart: firstTrainTime,
            Interval: frequency,
            //AwayTime: minutesAway,
            //NextArrival: nextArrival,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

    });
        // END of Data Submision to DB

        //connect to DB to calculate and  load the data
        database.ref().orderByChild("dateAdded").limitToLast(20).on("child_added", function(snapshot) {
  
        //Create a variable for snapshot.val()
        var train = snapshot.val();
        
        //calculate time
        //get curent time in milisecond from jan 1, 1970
        //currentTime = Date.now();
       // var now = moment();
        var currentTime = moment();

console.log("current time is: " + currentTime);

console.log("start time is: " + train.TrainStart);

        //create relavent start time for the train
        var startThen = moment(train.TrainStart, "HH:mm").subtract(1, "years");
console.log("startThen time is: " + startThen);

        //calculate time difference in mili second
        var timeDifferenceMilisec = currentTime - startThen;
        //calculate time difference in minutes
        var timeDifference = Math.round(timeDifferenceMilisec/60000);

console.log("time Difference is: " + timeDifference);
console.log("Frequency is: " + train.Interval);
        //minutes away
        var timeRemainder = timeDifference % train.Interval;
console.log("timeRemainder is: " + timeRemainder);

        var minutesAway = train.Interval - timeRemainder;
console.log("Minutes Away is: " + minutesAway);

        var next = moment().add(minutesAway, "minutes");

        var nextArrival = moment(next).format("hh:mm")


    //create table's <tobody>, adding class to <tobody>, constructing the table's <tr> and <td>
    var tabod = $('<tbody>');
    tabod.addClass('trainTable');
    tabod.append($("<tr>").html("<td>" + train.TrainName + "</td><td>" + train.Destination + "</td><td>" + train.Interval + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>"));

    //append the <tbody> to the table
    $('.table').append(tabod);

    // Handle the errors
 }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });






/////////////// END of SCRIPT //////////////////////    
});