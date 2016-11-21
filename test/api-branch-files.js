var fs = require("fs"),
    hc_path = "../index.js",
    hithercontent = require(hc_path),
    auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
    expect = require("chai").expect,
    https = require("https"),
    sinon = require("sinon"),
    PassThrough = require("stream").PassThrough;

var project_overview = {
    "data": [
        { "id": 1, "parent_id": 0 },
        { "id": 2, "parent_id": 0 },
        { "id": 11, "parent_id": 1 },
        { "id": 12, "parent_id": 1 },
        { "id": 121, "parent_id": 12 },
        { "id": 122, "parent_id": 12 },
        { "id": 123, "parent_id": 12 },
        { "id": 21, "parent_id": 2 },
        { "id": 22, "parent_id": 2 },
        { "id": 221, "parent_id": 22 }
    ]
};

var project_content = {
    "1": { "data": { "id": 1, "position": "1", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "2": { "data": { "id": 2, "position": "4", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "11": { "data": { "id": 11, "position": "2", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "12": { "data": { "id": 12, "position": "3", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "121": { "data": { "id": 121, "position": "7", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "122": { "data": { "id": 122, "position": "6", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "123": { "data": { "id": 123, "position": "5", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "21": { "data": { "id": 21, "position": "8", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "22": { "data": { "id": 22, "position": "9", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "221": { "data": { "id": 221, "position": "10", "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } }
};

var file_content = {
  "1": { "data": [
      { "id": 1, "field": "abc123", "type": "1", "url": "http://link.to/filename.png", "filename": "original.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" }
  ] },
  "2": { "data": [
      { "id": 2, "field": "abc123", "type": "1", "url": "http://link.to/filename.png", "filename": "original.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" }
  ] }
}

describe("Using the branch selector", function () {

    before(function () {
        hithercontent.init(auth);
    });

    after(function() {
        hithercontent.reset()
    })

    beforeEach("using mock API to approximate GatherContent", function () {
        sinon.stub(https, "get", function (options, callback) {
            var request = new PassThrough(),
                response = new PassThrough(),
                auth_check = auth.user + ":" + auth.akey,
                path = options.hasOwnProperty("path") && options.path,
                item_number;
            if (typeof callback === "function") {
                callback(response);
            }
            if (options.hasOwnProperty("auth") && (options.auth === auth_check)) {
                if (path === "/items?project_id=111111") {
                    response.write(JSON.stringify(project_overview));
                } else if (item_number = path.match(/\/items\/(.*)\/files/)) {
                  if (file_content.hasOwnProperty(item_number[1])) {
                    response.write(JSON.stringify(project_content[file_number[1]]));
                  }
                } else if (item_number = path.match(/\/items\/(.*)/)) {
                    if (project_content.hasOwnProperty(item_number[1])) {
                        response.write(JSON.stringify(project_content[item_number[1]]));
                    }
                }
            } else {
                response.write("Invalid credentials.")
            }
            response.end();
            return request;
        });
    });

    afterEach("restoring real API call", function () {
        https.get.restore();
    });

    describe("without specifiying an item id", function() {
    });
});
