var fs = require("fs"),
    hc_path = "../index.js",
    hithercontent = require(hc_path),
    auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
    expect = require("chai").expect;

describe("Getting JSON from API", function() {
    describe("without initialisation", function () {
        it("should inform the user that the `hithercontent` has not been properly initialised", function (done) {
            hithercontent.getJSONfromAPI("/items/0", function (data) {
                expect(data).to.be.an("object");
                done();
            });
        })
    });

    describe("using an incorrect path", function () {
        it("should inform the user that an incorrect path has been provided", function (done) {
            hithercontent.init(auth);
            hithercontent.getJSONfromAPI("/items/0", function (data) {
                expect(data).to.be.an("array");
                done();
            });
        });
    });

    describe("from a correct path", function () {
        it("should return a usable data object", function (done) {
            hithercontent.getJSONfromAPI("/items/1512999", function (data) {
                expect(data).to.be.an("object");
                done();
            });
        })
    });
});
