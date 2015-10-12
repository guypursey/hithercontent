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
          console.log("File written.", output);
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



var items = {};

var processItem = function (d) {
  d.data.config.forEach(function (v, i, a) {
    var tab_label = v.label;
    v.elements.forEach(function (v, i, a) {
      var k = tab_label + "_" + v.label;
      k = k && k.replace(/\s/g, "-");
      if (v.type === "text") {
        items[d.data.id][k] = v.value;
      } else if (v.type === "choice_checkbox" || v.type === "choice_radio") {
        items[d.data.id][k] = v.options.filter(function (v, i, a) {
          return v.selected;
        }).map(function (v, i, a) {
          return v.label;
        });
      }
    });
  });

  fs.writeFile("items/" + d.data.id + ".json", JSON.stringify(items[d.data.id], null, "\t"), { "encoding": "utf8" }, function (c, e) {
    if (e) throw e;
    console.log("file written", d.data.id);
  });
};


var items_cb = function (d) {
  var i = d.data.length;
  while (i) {
    i--;
    items[d.data[i].id] = {};
    getJSONfromAPI("/items/" + d.data[i].id, "raw/" + d.data[i].id + ".json", processItem);
  }
};

getJSONfromAPI(request, "output.json", items_cb);
