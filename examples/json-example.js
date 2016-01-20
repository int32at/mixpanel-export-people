//initialize a new mp instance with your mixpanel key and secret
var mp = new require("../index.js")("key", "secret");

//returns the mixpanel users as json objects
var users = mp.people.toJson();

var user = users[0];

//print distinct id
console.log(user["$distinct_id"]);

//print city
console.log(user["$properties"]["$city"]);
