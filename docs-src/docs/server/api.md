---
title: Server API
---


## Auspice client requests

The Auspice server handles requests to 3 API endpoints made by the Auspice client:
* `/charon/getAvailable` (returns a list of available datasets and narratives)
* `/charon/getDataset` (returns the requested dataset)
* `/charon/getNarrative` (returns the requested narrative)



### `/charon/getAvailable`

**URL query arguments:**

* `prefix` (optional) - the pathname of the requesting page in Auspice.
The `getAvailable` handler can use this to respond according appropriately.
Unused by the default Auspice handler.

**JSON Response (on success):**

```json
{
  "datasets": [
    {
      "request": "[required] The pathname of a valid dataset. \
          Will become the prefix of the getDataset request.",
      "buildUrl": "[optional] A URL to display in the sidebar representing \
          the build used to generate this analysis.",
      "secondTreeOptions": "[optional] A list of requests which should \
          appear as potential second-trees in the sidebar dropdown"
    },
    ...
  ],
  "narratives": [
    {"request": "URL of a narrative. Will become the prefix in a getNarrative request"},
    ...
  ]
}
```

Failure to return a valid JSON will result in a warning notification shown in Auspice.

### `/charon/getDataset`

**URL query arguments:**

* `prefix` (required) - the pathname of the requesting page in Auspice. Use this to determine which dataset to return.
* `type` (optional) -- if specified, then the request is for an additional file (e.g. "tip-frequencies"), not the main dataset.

**JSON Response (on success):**

The JSON response depends on the file-type being requested.

If the type is not specified, i.e. we're requesting the "main" dataset JSON then [see this JSON schema](https://github.com/nextstrain/augur/blob/master/augur/data/schema-export-v2.json).
Note that the Auspice client _cannot_ process v1 (meta / tree) JSONs -- [see below](server/api.md#importing-code-from-auspice) for how to convert these.

Alternative file type reponses are to be documented.

**Alternative responses:**

A `204` reponse will cause Auspice to show its splash page listing the available datasets & narratives.
Any other non-200 reponse behaves similarly but also displays a large "error" message indicating that the dataset was not valid.



### `/charon/getNarrative`

**URL query arguments:**

* `prefix` (required) - the pathname of the requesting page in Auspice. Use this to determine which narrative to return.

**JSON Response (on success):**

The output from the [parseNarrativeFile](server/api.md#parsenarrativefile) function defined below.
For instance, here is the code from the default Auspice handler:
```js
const fileContents = fs.readFileSync(pathName, 'utf8');
const blocks = parseNarrative(fileContents);
res.send(JSON.stringify(blocks).replace(/</g, '\\u003c'));
```

> Note that in a future version of Auspice we plan to move the parsing of the narrative to the client.

---

## Suppling custom handlers to the Auspice server

The provided Auspice servers -- i.e. `auspice view` and `auspice develop` both have a `--handlers <JS>` option which allows you to define your own handlers.
The provided JavaScript file must export three functions, each of which handles one of the GET requests described above and must respond accordingly (see above for details).

| function name | arguments | API endpoint |
| ----------    | --------- | ----------  |
| getAvailable | req, res | /charon/getAvailable |
| getDataset   | req, res | /charon/getDataset |
| getNarrative | req, res | /charon/getNarrative |

For information about the `req` and `res` arguments see the express documentation for the [request object](https://expressjs.com/en/api.html#req) and [response object](https://expressjs.com/en/api.html#res), respectively.

You can see [nextstrain.org](https://nextstrain.org)'s implementation of these handlers [here](https://github.com/nextstrain/nextstrain.org/blob/master/server.js).

Here's a pseudocode example of an implementation for the `getAvailable` handler which may help understanding:

```js
const getAvailable = (req, res) => {
  try {
    /* collect available data */
    res.json(data);
  } catch (err) {
    res.statusMessage = `error message to display in client`;
    console.log(res.statusMessage); /* printed by the server, not the client */
    return res.status(500).end();
  }
};
```

---

## Importing code from Auspice

The servers included in Auspice contain lots of useful code which you may want to use to either write your own handlers or entire servers.
For instance, the code to convert v1 dataset JSONs to v2 JSONs (which the client requires) can be imported into your code so you don't have to reinvent the wheel!


Currently
```js
const auspice = require("auspice");
```
returns an object with two properties:

### `convertFromV1`

**Signature:**
```js
const v2json = convertFromV1({tree, meta})
```
where `tree` is the v1 tree JSON, and `meta` the v1 meta JSON.

**Returns:**

An object representing the v2 JSON [defined by this schema](https://github.com/nextstrain/augur/blob/master/augur/data/schema-export-v2.json).



### `parseNarrativeFile`

**Signature:**

```js
const blocks = parseNarrativeFile(fileContents);
```
where `fileContents` is a string representation of the narrative Markdown file.

**Returns:**

An array of objects, each entry representing a different narrative "block" or "page".
Each object has properties
* `__html` -- the HTML to render in the sidebar to form the narrative
* `dataset` -- the dataset associated with this block
* `query` -- the query associated with this block

