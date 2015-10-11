var https = require("https"),
  fs = require ("fs"),
  auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" }));

var options = {
  auth: auth.user + ":" + auth.pass,
  headers: {
    "Accept": "application/vnd.gathercontent.v0.5+json"
  },
  host: "api.gathercontent.com",
  path: "/items?project_id=" + auth.project
};

var req = https.get(options, function (res) {

  var body = "";

  console.log(res.statusCode);

  res.on("data", function (d) {
    body += d;
  });

  res.on("end", function () {
    var d = JSON.parse(body);
    var c = JSON.stringify(d, null, "\t");
    fs.writeFile("output.json", c, { "encoding": "utf8" }, function (d, e) {
      if (e) throw e;
    })
  });

});

req.on("error", function (e) {
  console.log(e);
})
