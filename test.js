var https = require("https"),
  fs = require("fs"),
  auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
  request = "/items?project_id=" + auth.project,
  source = fs.readFileSync("./layouts/default.html", { "encoding": "utf8" }),
  handlebars = require("handlebars"),
  layout = handlebars.compile(source);

var getJSONfromAPI = function (request, callback) {

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

    res.on("data", function (chunk) {
      body += chunk;
    });

    res.on("end", function () {
      var data = JSON.parse(body);
      if (callback && typeof callback === "function") {
        callback(data);
      }
    });

  });

  req.on("error", function (e) {
    console.log(e);
  });

};

var reduceItemToKVPairs = function (d) {
  var item = {};
  d.data.config.forEach(function (v, i, a) {
    var tab_label = v.label;
    v.elements.forEach(function (v, i, a) {
      var k = tab_label + "_" + v.label;
      k = k && k.replace(/\s/g, "-");
      if (v.type === "text") {
        item[k] = v.value;
      } else if (v.type === "choice_checkbox" || v.type === "choice_radio") {
        item[k] = v.options.filter(v => v.selected).map(v => v.label);
      }
    });
  });
  return item;
};




var items = {};

var processItem = function (d) {

  var item = reduceItemToKVPairs(d);

  // write raw JSON for each item to its own file in a `raw` folder
  fs.writeFile("raw/" + d.data.id + ".json", JSON.stringify(d, null, "/t"), { "encoding": "utf8" }, function (c, e) {
    if (e) throw e;
    console.log("Item written", d.data.id);
  });

  // write each reduced item (key-value pairs) to its own file in an `items` folder
  fs.writeFile("items/" + d.data.id + ".json", JSON.stringify(item, null, "\t"), { "encoding": "utf8" }, function (c, e) {
    if (e) throw e;
    console.log("Item written", d.data.id);
  });

  fs.writeFile("pages/" + d.data.id + ".html", layout(item), { "encoding": "utf8" }, function (c, e) {
    if (e) throw e;
    console.log("Page written", d.data.id);
  });
};


var processAllItems = function (d) {
  var i = d.data.length;
  while (i) {
    i--;
    items[d.data[i].id] = {};
    getJSONfromAPI("/items/" + d.data[i].id, processItem);
  }
};

getJSONfromAPI(request, processAllItems);
