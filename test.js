var https = require("https"),
  fs = require("fs"),
  auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
  request = "/items?project_id=" + auth.project;

var getJSONfromAPI = function (request, output, callback) {

  var options = {
    auth: auth.user + ":" + auth.pass,
    headers: {
      "Accept": "application/vnd.gathercontent.v0.5+json"
    },
    host: "api.gathercontent.com",
    path: request
  };

  var req = https.get(options, function (res) {

    var body = "";

    res.on("data", function (d) {
      body += d;
    });

    res.on("end", function () {
      var d = JSON.parse(body);
      if (output && typeof output === "string") {
        var c = JSON.stringify(d, null, "\t");
        fs.writeFile(output, c, { "encoding": "utf8" }, function (d, e) {
          if (e) throw e;
        });
      }
      if (callback && typeof callback === "function") {
        callback(d);
      }
    });

  });

  req.on("error", function (e) {
    console.log(e);
  });

};

getJSONfromAPI(request, "output.json");
