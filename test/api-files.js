var fs = require("fs"),
    hc_path = "../index.js",
    hithercontent = require(hc_path),
    auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
    expect = require("chai").expect,
    https = require("https"),
    sinon = require("sinon"),
    PassThrough = require("stream").PassThrough;

var project_content = {
		"1": { "data": { "id": 1, "position": "1", "config": [ { "label": "First tab", "elements": [ { "type": "files", "name": "el1", "label": "Files element", "value": "Lorem ipsum" } ] } ] } },
		"2": { "data": { "id": 2, "position": "2", "config": [ { "label": "First tab", "elements": [
			 { "type": "files", "name": "el2", "label": "Files element" },
			 { "type": "text", "name": "el3", "label": "Text element", "value": "Lorem ipsum" }
		] } ] } },
		"3": { "data": { "id": 3, "position": "3", "config": [ { "label": "First tab", "elements": [
			 { "type": "files", "name": "el4", "label": "Files element" },
		] } ] } }
}
var file_content = {
	"1": { "data": [
			{ "id": 1, "field": "el1", "type": "field", "url": "http://link.to/filename1.png", "filename": "file1.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" }
	] },
	"2": { "data": [
			{ "id": 2, "field": "el2", "type": "field", "url": "http://link.to/filename2.png", "filename": "file2.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" },
	] },
	"3": { "data": [
			{ "id": 3, "field": "el4", "type": "field", "url": "http://link.to/filename3.png", "filename": "file3.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" },
			{ "id": 4, "field": "el4", "type": "field", "url": "http://link.to/filename4.png", "filename": "file4.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" }
	] }
}

describe("Using the file requester for an item", function () {


    before(function () {
        hithercontent.init(auth);
    });

    after(function() {
        hithercontent.reset()
    })

    beforeEach("using mock API to approximate GatherContent", function () {

			project_content = {
					"1": { "data": { "id": 1, "position": "1", "config": [ { "label": "First tab", "elements": [ { "type": "files", "name": "el1", "label": "Files element", "value": "Lorem ipsum" } ] } ] } },
					"2": { "data": { "id": 2, "position": "2", "config": [ { "label": "First tab", "elements": [
						 { "type": "files", "name": "el2", "label": "Files element" },
						 { "type": "text", "name": "el3", "label": "Text element", "value": "Lorem ipsum" }
					] } ] } },
					"3": { "data": { "id": 3, "position": "3", "config": [ { "label": "First tab", "elements": [
						 { "type": "files", "name": "el4", "label": "Files element" },
					] } ] } }
			}

			file_content = {
			  "1": { "data": [
			      { "id": 1, "field": "el1", "type": "field", "url": "http://link.to/filename1.png", "filename": "file1.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" }
			  ] },
			  "2": { "data": [
			      { "id": 2, "field": "el2", "type": "field", "url": "http://link.to/filename2.png", "filename": "file2.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" },
			  ] },
				"3": { "data": [
			      { "id": 3, "field": "el4", "type": "field", "url": "http://link.to/filename3.png", "filename": "file3.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" },
			      { "id": 4, "field": "el4", "type": "field", "url": "http://link.to/filename4.png", "filename": "file4.png", "size": 123456, "created_at": "2015-12-10 18:49:17", "updated_at": "2015-12-10 18:49:17" }
			  ] }
			}

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
                    response.write(JSON.stringify(file_content[item_number[1]]));
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

    describe("while specifying an item with one field and one item", function() {
      it("should return an object", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item).to.be.an("object")
					done()
				})
			})
			it("should return an object still containing a `data` property", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item).to.be.have.keys("data")
					done()
				})
			})
			it("should return an object still containing a data property with a `config` property", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data).to.be.have.property("config")
					done()
				})
			})
			it("should return an object where config is still an array", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config).to.be.an("array")
					done()
				})
			})
			it("should return an object where `config` still only contains one item", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config).to.have.length(1)
					done()
				})
			})
			it("should return an object where the only `config` item has an `elements` property", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0]).to.have.property("elements")
					done()
				})
			})
			it("should return an object where `elements` still only contains one item", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements).to.have.length(1)
					done()
				})
			})
			it("should return an object where the one element has a `url` property", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0]).to.be.have.property("url")
					done()
				})
			})
			it("should return an object where the one element has a `filename` property", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0]).to.be.have.property("filename")
					done()
				})
			})
			it("should return an object where the single `url` property is an array", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0].url).to.be.an("array")
					done()
				})
			})
			it("should return an object where the single `filename` property is an array", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0].filename).to.be.an("array")
					done()
				})
			})
			it("should return an object where the one `url` array has one element", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0].url).to.have.length(1)
					done()
				})
			})
			it("should return an object where the one `filename` property has one element", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0].filename).to.have.length(1)
					done()
				})
			})

			it("should return an object where the single `url` element is `http://link.to/filename1.png`", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0].url[0]).to.eql("http://link.to/filename1.png")
					done()
				})
			})
			it("should return an object where the single `filename` property is `file1.png`", function(done) {
				hithercontent.getFilesForItem(project_content["1"], function(item) {
					expect(item.data.config[0].elements[0].filename[0]).to.eql("file1.png")
					done()
				})
			})

    })

		describe("while specifying an item with two fields but one file", function() {
			it("should return an object", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item).to.be.an("object")
					done()
				})
			})
			it("should return an object still containing a `data` property", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item).to.be.have.keys("data")
					done()
				})
			})
			it("should return an object still containing a data property with a `config` property", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data).to.be.have.property("config")
					done()
				})
			})
			it("should return an object where config is still an array", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config).to.be.an("array")
					done()
				})
			})
			it("should return an object where `config` still only contains one item", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config).to.have.length(1)
					done()
				})
			})
			it("should return an object where the only `config` item has an `elements` property", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0]).to.have.property("elements")
					done()
				})
			})
			it("should return an object where `elements` still only contains one item", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements).to.have.length(2)
					done()
				})
			})
			it("should return an object where the first element is still a `files` type", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0]).to.have.property("type", "files")
					done()
				})
			})
			it("should return an object where the second element is still a `text` type", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[1]).to.have.property("type", "text")
					done()
				})
			})
			it("should return an object where the first/files element has a `url` property", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0]).to.have.property("url")
					done()
				})
			})
			it("should return an object where the first/files element has a `filename` property", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0]).to.have.property("filename")
					done()
				})
			})
			it("should return an object where the single `url` property is an array", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0].url).to.be.an("array")
					done()
				})
			})
			it("should return an object where the single `filename` property is an array", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0].filename).to.be.an("array")
					done()
				})
			})
			it("should return an object where the one `url` array has one element", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0].url).to.have.length(1)
					done()
				})
			})
			it("should return an object where the one `filename` property has one element", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0].filename).to.have.length(1)
					done()
				})
			})

			it("should return an object where the single `url` element is `http://link.to/filename2.png`", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0].url[0]).to.eql("http://link.to/filename2.png")
					done()
				})
			})
			it("should return an object where the single `filename` property is `file2.png`", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[0].filename[0]).to.eql("file2.png")
					done()
				})
			})
			it("should return an object where the second/text element does not have a `url` property", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[1]).to.not.have.property("url")
					done()
				})
			})
			it("should return an object where the second/text element does not have a `filename` property", function(done) {
				hithercontent.getFilesForItem(project_content["2"], function(item) {
					expect(item.data.config[0].elements[1]).to.not.have.property("filename")
					done()
				})
			})
		})

		describe("while specifying an item with one field but two files", function() {
			it("should return an object", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item).to.be.an("object")
					done()
				})
			})
			it("should return an object still containing a `data` property", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item).to.be.have.keys("data")
					done()
				})
			})
			it("should return an object still containing a data property with a `config` property", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data).to.be.have.property("config")
					done()
				})
			})
			it("should return an object where config is still an array", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config).to.be.an("array")
					done()
				})
			})
			it("should return an object where `config` still only contains one item", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config).to.have.length(1)
					done()
				})
			})
			it("should return an object where the only `config` item has an `elements` property", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0]).to.have.property("elements")
					done()
				})
			})
			it("should return an object where `elements` still only contains one item", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements).to.have.length(1)
					done()
				})
			})
			it("should return an object where the one element has a `url` property", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0]).to.be.have.property("url")
					done()
				})
			})
			it("should return an object where the one element has a `filename` property", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0]).to.be.have.property("filename")
					done()
				})
			})
			it("should return an object where the single `url` property is an array", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].url).to.be.an("array")
					done()
				})
			})
			it("should return an object where the single `filename` property is an array", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].filename).to.be.an("array")
					done()
				})
			})
			it("should return an object where the one `url` array has one element", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].url).to.have.length(2)
					done()
				})
			})
			it("should return an object where the one `filename` property has one element", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].filename).to.have.length(2)
					done()
				})
			})

			it("should return an object where the single `url` element is `http://link.to/filename3.png`", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].url[0]).to.eql("http://link.to/filename3.png")
					done()
				})
			})
			it("should return an object where the single `filename` property is `file3.png`", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].filename[0]).to.eql("file3.png")
					done()
				})
			})

			it("should return an object where the single `url` element is `http://link.to/filename4.png`", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].url[1]).to.eql("http://link.to/filename4.png")
					done()
				})
			})
			it("should return an object where the single `filename` property is `file4.png`", function(done) {
				hithercontent.getFilesForItem(project_content["3"], function(item) {
					expect(item.data.config[0].elements[0].filename[1]).to.eql("file4.png")
					done()
				})
			})
		})

});
