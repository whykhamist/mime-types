# mime-types

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]

The ultimate javascript content-type utility.

Forked from [mime-types][fork-url]

- Written in typescript
- Created MimeTypes Class
- Changed function names

  | old         | new                               |
  | ----------- | --------------------------------- |
  | lookup      | [getMime](#getmime)               |
  | contentType | [getContentType](#getcontenttype) |
  | extension   | [getExtension](#getextension)     |
  | charset     | [getCharset](#getcharset)         |

## Adding Types

All mime types are based on [mime-db](https://www.npmjs.com/package/mime-db),
so open a PR there if you'd like to add mime types.

## API

- [Installation](#installation)
- [Getting Started](#getting-started)
  - [CJS](#cjs)
  - [ESM](#ESM)
  - [Others](#others)
- [Properties](#properties)
  - [types](#types)
  - [typeSets](#typesets)
  - [extensions](#extensions)
- [Methods](#methods)
  - [getMime](#getmime)
  - [getMimes](#getmimes)
  - [getContentType](#getcontenttype)
  - [getExtension](#getextension)
  - **New:** [getExtensions](#getextensions)
  - [getCharset](#getcharset)

## Getting Started

### Installation

```sh
$ npm i @whykhamist/mime-types

or

$ yarn add @whykhamist/mime-types
```

### CJS

<!-- prettier-ignore-start -->
```js
const mime = require("@whykhamist/mime-types").default;
mime.getMime(...)

OR

// const MimeTypes = require("@whykhamist/mime-types").MimeTypes;
// const MimeDb = require("@whykhamist/mime-types").MimeDb;
const { MimeTypes, MimeDb } = require("@whykhamist/mime-types");
const mime = new MimeTypes(MimeDb);
mime.getMime(...)

OR

const { types, extensions, typeSets, getMime, getMimes, getContentType, getExtension, getCharset } = require("@whykhamist/mime-types");
```

### ESM

```js
import mime from "@whykhamist/mime-types";
mime.getMime(...)

OR

import { MimeTypes, MimeDb } from "@whykhamist/mime-types";
const mime = new MimeTypes(MimeDb);
mime.getMime(...)

OR

const { types, extensions, typeSets, getMime, getMimes, getContentType, getExtension, getCharset } from "@whykhamist/mime-types";
```

### Others
```js
import db from "mime-db/db.json";
import { MimeTypes } from "@whykhamist/mime-types";
import { MimeDatabase } from "mime-db";

const mime = new MimeTypes(db as MimeDatabase);
```

### extname

> By default, the class uses regex to extract the file extension from a path string. If you want to use other function for the extraction **(ex. Node.js path.extname)**, then create a new `MimeTypes` instance and add the function as a second paramenter

```js
import { extname } from "path";
const mime = new MimeTypes(db, extname);
```

> Make sure that the function takes a string (path) and returns the file extension. Must return any falsy value if no extension could be identified.

#### Regex used

```js
/^.+\.([^.]+)$/
```

<!-- prettier-ignore-end -->

## Properties

### types

A map of content-types by extension.

```js
const type = types["mp3"];
// "audio/mpeg"
```

### typeSets

A map of array of content types by extension.

```js
const types = typeSets["mp3"];
// [ 'audio/mp3', 'audio/mpeg' ]
```

### extensions

A map of extensions by content-type.

```js
const exts = extensions["text/x-c"];
// [ "c", "cc", "cxx", "cpp", "h", "hh", "dic" ]
```

## Methods

All functions return `false` if input is invalid or not found.

### getMime

Lookup the content-type associated with a file.

```js
getMime("json"); // 'application/json'
getMime(".md"); // 'text/markdown'
getMime("file.html"); // 'text/html'
getMime("folder/file.js"); // 'application/javascript'
getMime("folder/.htaccess"); // false

getMime("cats"); // false
```

### getMimes

Find all content-types that are associated with a file.

```js
getMimes("mp3"); // [ "audio/mpeg", "audio/mp3" ]
getMimes("path/to/file.rtf"); // [ "application/rtf", "text/rtf" ]
getMimes("c:\\path\\to\\file.bmp"); // [ "image/x-ms-bmp", "image/bmp", ]
```

### getContentType

Create a full content-type header given a content-type or extension.
When given an extension, `mime.lookup` is used to get the matching
content-type, otherwise the given content-type is used. Then if the
content-type does not already have a `charset` parameter, `mime.charset`
is used to get the default charset and add to the returned content-type.

```js
getContentType("markdown"); // 'text/x-markdown; charset=utf-8'
getContentType("file.json"); // 'application/json; charset=utf-8'
getContentType("text/html"); // 'text/html; charset=utf-8'
getContentType("text/html; charset=iso-8859-1"); // 'text/html; charset=iso-8859-1'

// from a full path
getContentType(path.extname("/path/to/file.json")); // 'application/json; charset=utf-8'
```

### getExtension

Get the default extension for a content-type.

```js
getExtension("application/octet-stream"); // 'bin'

// Using wildcards
getExtension("image/*"); // jpg
```

### getExtensions

Get all extensions for a content-type.

```js
getExtensions("application/octet-stream"); // [ 'bin' ]

// Using wildcards
getExtensions("text/html"); // [ 'html', 'htm', 'shtml' ]
getExtensions("image/jpeg"); // [ 'jpg', 'jpeg', 'jpe' ]
getExtensions("video/*"); /** [
  'mp4',   'ts',   'webm', 'qt',   'mj2',  'ogv',
  'mts',   '3gp',  'm2t',  'mpg',  'mpe',  'm1v',
  'm2v',   '3g2',  'm4s',  'mpg4', 'mjp2', 'mp4v',
  '3gpp',  'h261', 'h263', 'h264', 'jpgv', 'm2ts',
  'mpeg',  'mov',  'fvt',  'viv',  'uvh',  'uvp',
  'uvs',   'mxu',  'm4u',  'dvb',  'uvu',  'uvv',
  'uvm',   'pyv',  'uvvh', 'uvvp', 'uvvs', 'uvvu',
  'uvvv',  'uvvm', 'm4v',  'mkv',  'wm',   'f4v',
  'fli',   'flv',  'mng',  'smv',  'asf',  'asx',
  'vob',   'wmv',  'wmx',  'wvx',  'mks',  'mk3d',
  'movie', 'avi'
]*/
```

### getCharset

Lookup the implied default charset of a content-type.

```js
getCharset("text/markdown"); // 'UTF-8'
```

## License

[MIT](LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/@whykhamist/mime-types
[npm-url]: https://www.npmjs.com/package/@whykhamist/mime-types
[npm-version-image]: https://badgen.net/npm/v/@whykhamist/mime-types
[fork-url]: https://github.com/jshttp/mime-types
