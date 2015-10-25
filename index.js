var https = require("https");

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
        var data = (typeof body === "object") ? JSON.parse(body) : {};
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
                    var k = tab_label + "_" + v.label;
                    k = k && k.replace(/\s/g, "-");
                    if (v.type === "text") {
                        item[k] = v.value;
                    } else if (v.type === "choice_checkbox" || v.type === "choice_radio") {
                        item[k] = v.options.filter(v => v.selected).map(v => v.label);
                    }
                });
            });
        }
    }
    return item;
  };

  return {
    init: init,
    getJSONfromAPI: getJSONfromAPI,
    reduceItemToKVPairs: reduceItemToKVPairs,
  }

}());
