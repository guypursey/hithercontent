var fs = require("fs"),
  auth = {
    "user": "",
    "pass": "",
    "project": ""
  },
  astr = JSON.stringify(auth, null, "\t");

fs.writeFile("_auth2.json", astr, { "encoding": "utf-8" }, function (d, e) {
  if (e) throw e;
});
