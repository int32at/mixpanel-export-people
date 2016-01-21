# mixpanel-export-people
A Node.js package that can export data from Mixpanel

### Why another "Mixpanel Export" module?
I know there are many different modules that provide the same or even more functionality but the difference is simple - they don't let you export **EVERYTHING**. Ever tried to export your 20k users into a file using these scripts? Doesn't work - because Mixpanel caps responses at 1000  (page size) so it will only export the first 1000 items from your actual data. No script was able to export all data, so i wrote it myself.

### Installation

Install using `npm install mixpanel-export-people --save`

### Usage

Get your `API KEY` and `API SECRET` from your Mixpanel profile and pass them to the constructor;

```js
//initialize a new mp instance with your mixpanel key and secret
var mp = new require("../index.js")("API KEY", "API SECRET");

//returns the mixpanel users as json objects
var users = mp.people.toJson();

for (var i = 0; i < users.length; i++) {
	var user = users[i];

	//get the city
	var city = user["$properties"]["$city"];
}
```

To see more examples click [examples](/examples).

### API Methods

#### JSON

- **people.ToJson()**: returns the users as json objects

```js
var users = mp.people.toJson();

//get the city
var city = users[0]["$properties"]["$city"];
```

- **people.saveJson(path)**: saves the users in json format at `path`

```js
mp.people.saveJson("example.json");
```

#### CSV

- **people.toCsv()**: returns the users as csv string

```js
var csv = mp.people.toCsv();

console.log(csv);
```

- **people.saveCsv(path)**: saves the users in csv format at `path`

```js
mp.people.saveJson("example.csv");
```

#### Utilities

- **people.url()**: returns a valid url to the `engage` endpoint, inlcuding `expire`, `api_key` and a valid `sig`. You can request the data in the browser etc. using this url.

```js
var url = mp.people.url();

console.log(url);
```

### Notes
Instead of using the `request` module this script uses the `sync-request` module to retreive the data - which means a calls to `toJson()`, `saveJson()`, `toCsv()`, `saveCsv()` will be blocking calls. This is because Mixpanel does not provide a method to request different pages in parallel. 
