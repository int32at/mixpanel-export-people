//initialize a new mp instance with your mixpanel key and secret
var mp = new require("../index.js")("key", "secret");

//saves the exported data into json file
mp.people.saveJson("json-save-example.json");

console.log("file saved!");
