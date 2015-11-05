var fs = require("fs"),
    hc_path = "../index.js",
    hithercontent = require(hc_path),
    auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
    expect = require("chai").expect,
    https = require("https"),
    sinon = require("sinon"),
    PassThrough = require("stream").PassThrough;

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
