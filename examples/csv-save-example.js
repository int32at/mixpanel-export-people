//initialize a new mp instance with your mixpanel key and secret
var mp = new require("../index.js")("key", "secret");

//saves the exported data into csv file
mp.people.saveCsv("csv-save-example.csv");

console.log("file saved!");
