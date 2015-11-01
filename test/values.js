var fs = require("fs"),
    hc_path = "../index.js",
    hithercontent = require(hc_path),
    auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
    expect = require("chai").expect;

var sample_data = {
    	"data": {
    		"id": 1,
    		"project_id": 1,
    		"parent_id": 0,
    		"template_id": 1,
    		"custom_state_id": 0,
    		"position": "1",
    		"name": "Page name",
    		"config": [
    			{
    				"label": "First tab",
    				"name": "tab1",
    				"hidden": false,
    				"elements": [
    					{
    						"type": "choice_checkbox",
    						"name": "el1",
    						"required": false,
    						"label": "Checkbox example",
    						"microcopy": "Checkbox example microcopy.",
    						"options": [
    							{
    								"name": "op1a",
    								"label": "Option a",
    								"selected": false
    							},
    							{
    								"name": "op1b",
    								"label": "Option b",
    								"selected": true
    							},
                                {
    								"name": "op1c",
    								"label": "Option c",
    								"selected": true
    							}
    						]
    					},
    					{
    						"type": "choice_radio",
    						"name": "el2",
    						"required": false,
    						"label": "Multiple choice example",
    						"microcopy": "Multiple choice microcopy",
    						"other_option": false,
    						"options": [
    							{
    								"name": "op2a",
    								"label": "Yes",
    								"selected": false
    							},
    							{
    								"name": "op2b",
    								"label": "No",
    								"selected": true
    							}
    						]
    					},
    					{
    						"type": "text",
    						"name": "el3",
    						"required": false,
    						"label": "Text example",
    						"value": "Text example value",
    						"microcopy": "Text example microcopy",
    						"limit_type": "words",
    						"limit": 0,
    						"plain_text": true
    					}
                    ]
    			},
    			{
    				"label": "Second tab",
    				"name": "tab2",
    				"hidden": false,
    				"elements": [
    					{
    						"type": "section",
    						"name": "el4",
    						"title": "Section example title",
    						"subtitle": "<p>Section example subtitle</p>"
    					}
    				]
    			}
    		],
    		"notes": "",
    		"type": "item",
    		"overdue": false,
    		"created_at": {
    			"date": "2015-03-03 10:53:00.000000",
    			"timezone_type": 3,
    			"timezone": "UTC"
    		},
    		"updated_at": {
    			"date": "2015-10-20 19:32:12.000000",
    			"timezone_type": 3,
    			"timezone": "UTC"
    		},
    		"status": {
    			"data": {
    				"id": "261440",
    				"is_default": false,
    				"position": "7",
    				"color": "#0e90d2",
    				"name": "Verification by DCO",
    				"description": "DCOs to check print content, make any comments, and check facts with IOs. They can then update the web content accordingly.",
    				"can_edit": true
    			}
    		},
    		"due_dates": {
    			"data": []
    		}
    	}
    }

describe("Reducing GatherContent item JSON to key-value pairs", function () {
    describe("should return a simpler object", function () {
        it("where keys with spaces are replaced with hyphens", function () {
            var sample_data = {
                    "data": {
                        "key with several words": ""
                    }
                },
                result = hithercontent.reduceItemToKVPairs(sample_data)
            expect(result).to.have.all.keys(["_key-with-several-words"])
        })
        it("where keys for content are prefixed by their label name and an underscore", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result).to.have.property("First-tab_Text-example")
        })
        it("where keys for metadata are prefixed by an underscore", function () {
            var sample_data = {
                    "data": {
                        "key with several words": ""
                    }
                },
                result = hithercontent.reduceItemToKVPairs(sample_data)
            expect(result).to.have.all.keys(["_key-with-several-words"])
        })
    })

    describe("should declutter each content field value according to its type", function () {
        it("like the text type which should return as a string", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Text-example"]).to.be.a("string");
        })
        it("like the multiple choice type which should return as a string", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Multiple-choice-example"]).to.be.a("string");
        })
        it("like the checkboxes type which should return as an array", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Checkbox-example"]).to.be.an("array");
        })
        it("like the section type which should return as a string", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Section-example-example"]).to.be.an("string");
        })
        it("like the attachment type which should return as a string", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Attachment-example"]).to.be.a("string");
        })
    })

    describe ("should return each content field value accurately", function () {
        it("including text values", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Text-example"]).to.equal("Text example value");
        })
        it("including any selected multiple choice value", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Multiple-choice-example"]).to.equal("No");
        })
        it("including any ticked checkbox", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["First-tab_Checkbox-example"]).to.deep.equal(["Option b", "Option c"]);
        })
        it("including section titles and subtitles", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["Second-tab_Section-example-title"]).to.equal("<p>Section example subtitle</p>");
        })
        it("including attachments", function () {
            var result = hithercontent.reduceItemToKVPairs(sample_data);
            expect(result["Second-tab_Attachment-example"]).to.be.a("string");
        })
    })
})
