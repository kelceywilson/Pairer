// Variable to hold request
var request;
var students = [];

// Bind to the submit event of our form
$("#foo").submit(function(event){

  console.log(students);
  // Abort any pending request
  if (request) {
      request.abort();
  }
  // setup some local variables
  var $form = $(this);

  // Let's select and cache all the fields
  var $inputs = $form.find("input, select, button, textarea");

  // Serialize the data in the form
  var serializedData = $form.serialize();
  console.log(serializedData);
  // Let's disable the inputs for the duration of the Ajax request.
  // Note: we disable elements AFTER the form data has been serialized.
  // Disabled form elements will not be serialized.
  $inputs.prop("disabled", true);

  // Fire off the request to /form.php
  request = $.ajax({
    url: "https://script.google.com/macros/s/AKfycbyaau1ZUeCTlbk2qXLkUQHAh813ivuO9vGkAcZ95aiG2a0vb4s/exec",
    type: "post",
    data: serializedData
  });

  // Callback handler that will be called on success
  request.done(function (response, textStatus, jqXHR){
    // Log a message to the console
    console.log("Hooray, it worked!");
    console.log(response);
    console.log(textStatus);
    console.log(jqXHR);
  });

  // Callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown){
    // Log the error to the console
    console.error(
      "The following error occurred: " +
      textStatus, errorThrown
    );
  });

  // Callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {
    // Reenable the inputs
    $inputs.prop("disabled", false);
  });

  // Prevent default posting of form
  event.preventDefault();

  // This fills student array using inputs -- better to use google sheet as source
  var nameInput = document.getElementById("name");
  var emailInput = document.getElementById("email");
  var locationInput = document.getElementById("location");
  var timezoneInput = document.getElementById("timezone");
  var osInput = document.getElementById("os");
  var textEditorInput = document.getElementById("editor");
  var githubInput = document.getElementById("github");
  var slackInput = document.getElementById("slack");
  var submitStudentButton = document.getElementsByTagName("submit");
  var submitClassButton = document.getElementById("submitClass");
  students.push( {
    'name': nameInput.value,
    'email': emailInput.value,
    'location': locationInput.value,
    'timezone': timezoneInput.value,    // can default pull from ip address location?
    'os': osInput.value,
    'textEditor': textEditorInput.value,
    'github': githubInput.value,
    'slack': slackInput.value
  } );

});

// $("#pairStudentsNow").submit(function(event){

//   $.ajax({
//     url:'https://spreadsheets.google.com/feeds/list/1TawUPvPbJFR6xE6FcjwqkenuyQSJ-ndozK7Uuj3iYto/1/public/basic?alt=json',
//     success: function(data){
//       console.log(data);
//     }
//   });
// });

// var JSONURL = 'https://spreadsheets.google.com/feeds/list/1e4bE5Xk1w1d-N3-xWCYk9ilUA2kFn2TH629lrT_w-Gk/1/public/basic?alt=json';

// function callback(data){
//     var rows = [];
//     var cells = data.feed.entry;
    
//     for (var i = 0; i < cells.length; i++){
//         var rowObj = {};
//         rowObj.timestamp = cells[i].title.$t;
//         var rowCols = cells[i].content.$t.split(',');
//         for (var j = 0; j < rowCols.length; j++){
//             var keyVal = rowCols[j].split(':');
//             rowObj[keyVal[0].trim()] = keyVal[1].trim();
//         }
//         rows.push(rowObj);
//     }
    
//     var raw = document.createElement('p');
//     raw.innerText = JSON.stringify(rows);
//     document.body.appendChild(raw);
// }

// $(document).ready(function(){
    
//     $.ajax({
//         url: JSONURL,
//         success: function(data){
//             callback(data);
//         }
//     });

// });


// var uniquePairList = [];

// // thank you ruthie!!! - my pairmakers wasn't doing it
// function uniquePairmaker(set, k) {

//   var setSize = set.length;
//   var combs;
//   var head;
//   var tailcombs;

//   // case: group size is 1
//   if (k === 1) {
//     combs = [];
//     for (var i = 0; i < setSize; i++) {
//       combs.push([set[i]]);
//     }
//     return combs;
//   }

//   // between 1 and (set size - 1)
//   combs = [];
//   for (var i = 0; i < setSize - k + 1; i++) {
//     head = set.slice(i, i + 1);
//     tailcombs = uniquePairmaker(set.slice(i + 1), k - 1);
//     for (var j = 0; j < tailcombs.length; j++) {
//       combs.push(head.concat(tailcombs[j]));
//     }
//   }
//   return combs;
// }

// order matters try starting by filling all sessions with a single individual's pairs
// to at least ensure each session starts with one pair eliminated
  // how?  create an array of days
  // array needs to be filled with pre-existing objects to push the day of pairs into

// function pairSlotter( thisClass ){
// // Build array of just student emails
//   var thisClassSize = thisClass.length;
//   var uniquePairList = uniquePairmaker(thisClass, 2);
//   var uniquePairQuantity = uniquePairList.length;
//   var slotsPerDay = classSize / 2;
//   var daysOfUniquePairs = uniquePairQuantity / slotsPerDay;
//   var days = [];
//   for (var i = 0; i < daysOfUniquePairs; i++) {
//     days[i] = {
//       'daycount': i + 1,  // make day-numbering easy - not sure why but keys needed quotes
//       'pairList': [],  // js needs to know it's an array
//       'individuals': []  // flatten pairList to make dupecheck easy
//     };
//   }

//   // slot every unique pair into a day such that
//   //  - every unique pair meets exacly once
//   //  - no individual is paired more than once per day
//   var pairPoolQty = uniquePairQuantity; // this is the number of unassignedGroups 
//   var tempPair;  // pair being checked
//   var tempPairTracker; // indicates which pair to use
//   var tempDay;  // day being filled
//   var isAssignable; // to help pass over next function w/o convolution - thanks ruthie!!!
//   var isUnassignable; // added to avoid if/else convolution -- thanks again ruthiee!!!!
//   var pairsPassed = [];
//   // pairing should continue until all pairs are exhausted

//   while ( pairPoolQty > 0 ) {
//     isUnassignable = true;  

//     for (var i = 0; i < daysOfUniquePairs; i++) {
//       // if the choices have been exhaused, trash day & try again
//         if ( pairPoolQty === 0 ){
//           break;
//         }

//       // keep a temp level of dayList to ensure all day's slots are filled before pushing to daylist
//       tempPairTracker = uniquePairQuantity - pairPoolQty; // groups.length - groups.length = 0 at start
//       tempPair = uniquePairList[tempPairTracker];
//       tempDay = days[i];
//       //if thisPair is in tempDayList, don't add it -- loop over both individuals
    

//       isAssignable = true;  
//       for (var j = 0; j < tempPair.length; j++) {
//         if (tempDay.individuals.indexOf(tempPair[j]) !== -1) {
//           //
//           isAssignable = false;
//           break;
//         }
//       }

//       if (isAssignable) {
//         isUnassignable = false;
//         tempDay.pairList.push(tempPair);
//         tempDay.individuals = tempDay.individuals.concat(tempPair);
//         pairPoolQty--;
//       }
//     }

//     if (isUnassignable) {
//       pairsPassed.push(tempPair);
//       pairPoolQty--;
//     }
//   }
//   return days;
// }

// // !!  action item -- change this so that classPopulator runs after input box is filled and Submit button is pressed
// // display schedule in html
// function displaySchedule(schedule) {
//   for (var i = 0; i < schedule.length; i++) {
//     //console.log('DAY ', schedule[i].daycount);
//     $('body').append('<hr>DAY ' + schedule[i].daycount + ' - ');
//     for (var j = 0; j < schedule[i].pairList.length; j++) {
//       //console.log('PAIR ', schedule[i].pairList[j]);
//       $('body').append('  *  ' + schedule[i].pairList[j]);        
//     }
//   }
// }

// // for demonsration purposes, create a function that builds a students array of any size


// classPopulator = function(size) {
//   for (var i = 0; i < size; i++) {
//     students[i] = {
//       'name': i.toString(),
//       'email': i.toString() + "@foo.com"
//     }; // you have to create the empty object before you can assign it properties
//   }
// }
// var students = [];
// var classSize = parseInt(prompt("What size is your class?"));
// classPopulator(classSize);
// console.log(students);
// //var studentEmails = students.map( function(studentObj, i){ return studentObj.email; } );

// function studentEmailExtractor (arr) {
//   for (var i = 0; i < arr.length; i++) {
//     studentEmails.push(arr[i].email);
//   }
// }
// var studentEmails = [];
// studentEmailExtractor(students);

// console.log(studentEmails);

// var days = pairSlotter(studentEmails);

//displaySchedule(days);

// need to prettify - add names & format better
// need to attach to google sheet
// need to allow for input by either one by on or paste entire class

