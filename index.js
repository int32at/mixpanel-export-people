var MixpanelExporter = function(key, secret) {
  var self = this;

  //check input
  if(!key) throw new Error("Mixpanel API Secret not provided");
  if(!secret) throw new Error("Mixpanel API Secret not provided");

  //mixpanel api settings
  self.apiKey = key;
  self.apiSecret = secret;
  self.apiUrl = "http://mixpanel.com/api/2.0/";
  self.apiFormat = "json";

  //dependencies
  self.request = require("sync-request");
  self.md5 = require("md5");

  function result(service) {
    var self = this;
    self.service = service;

    function buildCsvHeaders(first) {
      var headers = [];
      //headers.push("$distinct_id");

      for(key in first["$properties"]) {
        headers.push(key);
      }

      return headers;
    }

    function pushContentToCsv(csv, content) {
        csv.push(content.join(";"));
    }

    function saveContent(path, content) {
      var fs = require("fs");
      fs.writeFile(path, content, function(err) {
          if(err) {
            throw Error(err);
          }
      });
    }

    return {
      url : function() {
        return getDataFrom(self.service, true);
      },

      toJson : function() {
        return getDataFrom(self.service);
      },

      toCsv : function() {
        var csv = [];

        var data = getDataFrom(self.service);

        // use the first entry to generate the headers
        var headers = buildCsvHeaders(data[0]);

        pushContentToCsv(csv, headers);

        for (var i = 0; i < data.length; i++) {
          var entry = data[i];

          var content = [];

          for (var j = 0; j < headers.length; j++) {
            content.push(entry["$properties"][headers[j]]);
          }

          pushContentToCsv(csv, content);
        }

        return csv.join("\n");
      },

      saveJson : function(path) {
        saveContent(path, JSON.stringify(this.toJson()));
      },

      saveCsv : function(path) {
        saveContent(path, this.toCsv());
      }
    }
  }

  function getDataFrom(service, skipRequest) {

    //default args
    var args = {};
    args["api_key"] = self.apiKey;
    args["expire"] = Date.now() + 1000;
    args["format"] = self.apiFormat;
    args["sig"] = createSig(args);

    var fullUrl = self.apiUrl + service;

    var hasResults = true;
    var data = [];

    while(hasResults) {

      var response = makeRequest(fullUrl, args, skipRequest);

      if(typeof skipRequest !== "undefined")
        return response;

      args["page"] = response.page + 1;
      args["session_id"] = response.session_id;
      args["sig"] = createSig(args);

      data = data.concat(response.results);

      hasResults = response.results.length == 1000;
    }

    return data;
  }

  function createSig(args) {
    //make sure we dont have a sig element already!
    delete args["sig"];

    //create the url params in format: key1=value1key2=value
    var params = createUrlParams(args, true);

    return self.md5(params + self.apiSecret);
  }

  function makeRequest(url, args, skipRequest) {
    url += createUrlParams(args);

    var result = "";

    if(typeof skipRequest === "undefined")
      result = self.request("GET", url);
    else
      return url;

    if(result.statusCode == 200) {
      return JSON.parse(result.getBody("utf8"));
    }
    else {
      throw Error("invalid request");
    }
  }

  /// helpers

  function createUrlParams(args, include) {
    var out = [];

    for(key in args) {
      out.push(key +"="+ args[key]);
    }

    //used as url parameters
    if(!include)
      return "?" + out.join("&");

    //used to calculate sig
    else {
      return out.sort().join("");
    }
  }

  return {
    people : new result("engage")
  }
}

module.exports = MixpanelExporter;
