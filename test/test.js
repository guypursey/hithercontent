var fs = require("fs"),
    hc_path = "../index.js",
    hithercontent = require(hc_path),
    auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
    expect = require("chai").expect,
    http = require("http"),
    sinon = require("sinon"),
    PassThrough = require("stream").PassThrough;

describe("Getting JSON from API", function() {

    beforeEach(function () {
        this.request = sinon.stub(http, "request");
    });

    afterEach(function () {
        http.request.restore();
    });

    describe("without initialisation", function () {
        it("should inform the user that the `hithercontent` has not been properly initialised", function (done) {
            var expected = { "hello": "world" },
                response = new PassThrough(),
                request = new PassThrough();

            response.write(JSON.stringify(expected));
            response.end();

            this.request
                .callsArgWith(1, response)
                .returns(request);

            hithercontent.getJSONfromAPI("/items/0", function (data) {
                expect(data).to.be.an("object");
                done();
            });
        })
    });

    describe.skip("using an incorrect path", function () {
        it("should inform the user that an incorrect path has been provided", function (done) {
            hithercontent.init(auth);
            hithercontent.getJSONfromAPI("/items/0", function (data) {
                expect(data).to.be.an("object");
                done();
            });
        });
    });

    describe.skip("from a correct path", function () {
        it("should return a usable data object", function (done) {
            hithercontent.getJSONfromAPI("/items/1512999", function (data) {
                expect(data).to.be.an("object");
                done();
            });
        })
    });
});
