# rdf-utils-fs

[![Build Status](https://travis-ci.org/rdf-ext/rdf-utils-fs.svg?branch=master)](https://travis-ci.org/rdf-ext/rdf-utils-dataset)
[![npm version](https://badge.fury.io/js/rdf-utils-fs.svg)](https://badge.fury.io/js/rdf-utils-dataset)

File system utils for RDF/JS.

## Usage with `@zazuko/env` (preferred)

```js
import { create } from '@zazuko/env'
import { FsUtilsFactory } from 'rdf-utils-fs'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import formats from '@rdfjs/formats-common'

// create an environment by adding FsUtilsFactory
const env = create(FsUtilsFactory)
// add parsers+serializers
env.formats.import(formats)

// parse
const parserStream = env.fromFile(`/path/to/data.nt`)
const dataset = await fromStream(env.dataset(), parserStream)

// serialise
await env.toFile(dataset, `/path/to/data.json`)
```

## Usage with an existing environment

Same as above, but the RDF/JS Environment is provided as first argument. 
That environment must implement RDF/JS DataFactory, [FormatsFactory](https://github.com/rdfjs-base/environment/blob/master/FormatsFactory.js).

```js
import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import formats from '@rdfjs/formats-common'

// add parsers+serializers
rdf.formats.import(formats)

// parse
const parserStream = fromFile(rdf, `/path/to/data.nt`)
const dataset = await rdf.dataset().import(parserStream)

// serialise
await env.toFile(rdf, dataset, `/path/to/data.json`)
```
    
## Functions

### fromFile(filename, options)

Returns a quad stream for the given `filename`.

### async toFile(stream, filename, options)

Writes the given quad stream to `filename`. 
