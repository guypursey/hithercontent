# `hithercontent`

A Node.js package for interacting with GatherContent's API.

## Usage

Create a JSON file containing an object with the following properties:

 - `user`: the value should be your username for your GatherContent account
 - `akey`: the value should be the API key -- you will need to generate this if
 you haven't already

Let's say your JSON file is called `_auth.json`. The following code will
initiate the `hithercontent` for use with your project.

    var fs = require("fs"),
        auth = JSON.parse(fs.readFileSync("_auth.json", { "encoding": "utf8" })),
        hithercontent = require("hithercontent");

    hithercontent.init(auth);

You can then use the initiated `hithercontent` object to fetch content from
the GatherContent API.

*(Tip: If using Git to version your code, add `_auth.js` or your equivalent filename to your `.gitignore` file. Storing your username and API key in a separate JSON file means you can version your code and share it without worrying about releasing the details to the public. By adding the authentication details filename to `.gitignore`, you remove the risk of accidentally commiting the details to your repository.)*

## Example

Assuming you have a string called `request` containing the API call details,
for example, where `project` is the project ID or number:

    var request = "/items?project_id=" + project;

You can then use the following to access and work with the content.

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

### `getProjectBranch`

#### Arguments

 - `project_id`: *String.* **Required.** The project ID for the project you want to fetch from.
 - `item_id`: *String.* **Optional.** The item ID for the branch you want to fetch. This will then get any items below this in the structure. If omitted, the whole project will be fetched.
 - `iterator`: *Function.* **Optional.** Should have one argument, which represents the item data that you expect to receive. You can use the iterator to determine how you want to receive each item in the branch you are retrieving. For example, you can use `hithercontent.reduceItemToKVPairs` (see below) to have your branch return with simplified values for use in a template. Or you can use an identity function (`i => i`) to return each item as it is. If this argument is not given, at present, each branch item's data property will be extracted (the equivalent of `i => i.data`).
 - `callback`: *Function.* **Required.** Should have one argument, which represents the branch you are retrieving, as an object. You can use this function to act on the branch asynchronously. Any item that sits under a parent item on GatherContent will be found in the `items` property of its parent item. If you specify an `item_id`, this means you will get your item at the top-level but it will feature an `items` property containing any items containing any child items from GatherContent, which in turn will each have their own items properties containing any children they have, and so on. If you do not specify `item_id` or set it to `0`, you will receive an object containing an `items` array within which you will find all the top-level items of the project, each with their own `items` property containing any children and so on.

#### Returns

Nothing. Acts asynchronously using the `callback` argument.

### `reduceItemToKVPairs`

#### Arguments

 - `data`: *Object.* **Required.** The object you want to reduce.

#### Returns

An object containing key-value pairs for each of the properties on a GatherContent page. This flattens everything in `config` and prefixes all the other data that the API gives you and simply gives you the properties and content for a page in a label and content format. The labels are formed by taking the label name from the page and prefixing it with the tab name, separated by an underscore. General properties for the page are simply prefixed with an underscore as they don't belong under a specific tab.
