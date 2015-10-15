# `hithercontent`

A Node.js package for interacting with GatherContent's API.

## Usage

Create a JSON file containing an object with the following properties:

 - `user`: the value should be your username for your GatherContent account
 - `akey`: the value should be the API key -- you will need to generate this if
 you haven't already

Let's say your JSON file is called `auth.json`. The following code will
initiate the `hithercontent` for use with your project.

    var fs = require("_auth.json"),
        hithercontent = require("hithercontent");

    hithercontent.init();

You can then use the initiated `hithercontent` object to fetch content from
the GatherContent API.

    hithercontent.getJSONfromAPI(request, function(data) {
        console.log(data);
    });


## Functions

### `getJSONfromAPI`

#### Arguments

 - `request`: *String.* **Required.** The path you are making a request to.
 - `callback`: *Function.* **Required.** Should have one argument, which represents the data that you expect to receive, as an object. You can use this function to act on the data asynchronously.

#### Returns

Nothing. Acts asynchronously using the `callback` argument.

### `reduceItemToKVPairs`

#### Arguments

 - `data`: Object. Required. The object you want to reduce.

#### Returns

An object containing key-value pairs for each of the properties on a GatherContent page. This gets rid of all the IDs and extraneous data that the API gives you and simply gives you the content on a page in a label and content format.
