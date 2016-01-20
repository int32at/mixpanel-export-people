//initialize a new mp instance with your mixpanel key and secret
var mp = new require("../index.js")("key", "secret");

//returns the mixpanel users in csv format
var csv = mp.people.toCsv();

//print csv data as string
console.log(csv);
