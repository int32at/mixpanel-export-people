//initialize a new mp instance with your mixpanel key and secret
var mp = new require("../index.js")("key", "secret");

//returns the mixpanel api url including all properties and valid signature
//you can manually request the data by using this link via a web browser etc.
var url = mp.people.url();

console.log(url);
