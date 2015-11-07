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
        { "id": "1", "parent_id": "0" },
        { "id": "2", "parent_id": "0" },
        { "id": "1a", "parent_id": "1" },
        { "id": "1b", "parent_id": "1" },
        { "id": "2a", "parent_id": "2" },
        { "id": "2b", "parent_id": "2" },
        { "id": "2b1", "parent_id": "2b" }
    ]
};

var project_content = [
    "1": { "data": { "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "2": { "data": { "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "1a": { "data": { "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "1b": { "data": { "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "2a": { "data": { "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "2b": { "data": { "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } },
    "2b1": { "data": { "config": [ { "label": "First tab", "elements": [ { "type": "text", "label": "Text element", "value": "Lorem ipsum" } ] } ] } }
]

describe("Using the branch selector", function() {

    beforeEach("using mock API to approximate GatherContent", function () {
        this.get = sinon.stub(https, "get", function (options, callback) {
            var request = new PassThrough(),
                response = new PassThrough(),
                auth_check = auth.user + ":" + auth.akey;
            if (typeof callback === "function") {
                callback(response);
            }
            if (options.hasOwnProperty("auth") && (options.auth === auth_check)) {
                response.write(JSON.stringify(options));
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

    it("should be able to fetch the whole project");

    it("should be able to fetch a single branch of the project");

    it("should be able to fetch a single item of the project");

});
