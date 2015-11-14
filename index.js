var https = require("https"),
    isjson = require("is-json");

module.exports = (function () {

  var auth = {};

  var init = function (cred) {
    if (typeof cred === "object") {
      if (cred.hasOwnProperty("user") && typeof cred.user === "string") {
        auth.user = cred.user;
      }
      if (cred.hasOwnProperty("akey") && typeof cred.akey === "string") {
        auth.akey = cred.akey;
      }
    }
  }

  var getJSONfromAPI = function (request, callback) {

    var options = {
      auth: auth.user + ":" + auth.akey,
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
        var data = isjson(body) ? JSON.parse(body) : {};
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
    var item = {},
        k;
    if (d.hasOwnProperty("data")) {
        for (k in d.data) {
            if (k !== "config" && d.data.hasOwnProperty(k)) {
                item["_" + k.replace(/\s/g, "-")] = d.data[k]
            }
        }
        if (d.data.hasOwnProperty("config") && Array.isArray(d.data.config)) {
            d.data.config.forEach(function (v, i, a) {
                var tab_label = v.label;
                v.elements.forEach(function (v, i, a) {
                    var k = tab_label + "_" + (v.label || v.title);
                    k = k && k.replace(/\s/g, "-");
                    if (v.type === "text") {
                        item[k] = v.value;
                    } else if (v.type === "choice_radio") {
                        item[k] = v.options.filter(v => v.selected).reduce((p, c) => p + c.label, "");
                    } else if (v.type === "choice_checkbox") {
                        item[k] = v.options.filter(v => v.selected).map(v => v.label);
                    } else if (v.type === "section") {
                        item[k] = v.subtitle;
                    }
                });
            });
        }
    }
    return item;
  };

  var getProjectBranch = function (project_id, item_id, callback) {

      var callback = (typeof callback === "function")
        ? callback
        : (typeof item_id === "function")
            ? item_id
            : function () {},
        item_id = typeof item_id === "string" ? item_id : "0",
        project_id = typeof project_id === "string" ? project_id : "",
        root = { "items": [] };

      hithercontent.getJSONfromAPI("/items?project_id=" + project_id, function (project_data) {

          var getSubItems = function(root_id, item_store) {
              hithercontent.getJSONfromAPI("/items/" + root_id, function (item_data) {
                  item_store.push(item_data.data);
                  item_data.data.items = [];
                  var subitems = project_data.data
                    .filter(i => i.parent_id === v.id)
                    .forEach(i => getSubItems(i.id, item_data.data.items));
              });
          };

          getSubItems(item_id, root.items);
      }
  };

  return {
    init: init,
    getJSONfromAPI: getJSONfromAPI,
    reduceItemToKVPairs: reduceItemToKVPairs,
  }

}());
