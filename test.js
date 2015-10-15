var fs = require("fs"),
  gathercontent = require("./index.js"),
  auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
  request = "/items?project_id=" + auth.project,
  source = fs.readFileSync("./layouts/default.html", { "encoding": "utf8" }),
  handlebars = require("handlebars"),
  layout = handlebars.compile(source);

// sample code using functions above

var items = {};

var processItem = function (d) {

  var item = gathercontent.reduceItemToKVPairs(d);

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

  // write each rendered item processed with Handlebars to its own file in a `pages` folder
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
    gathercontent.getJSONfromAPI("/items/" + d.data[i].id, processItem);
  }
};

gathercontent.init(auth);
gathercontent.getJSONfromAPI(request, processAllItems);
