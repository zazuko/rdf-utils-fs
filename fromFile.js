const config = require('./defaults')
const formats = require('@rdfjs/formats-common')
const { createReadStream } = require('fs')
const { extname } = require('path')

function fromFile (filename, { extensions = config.extensions } = {}) {
  const extension = extname(filename).split('.').pop()
  const mediaType = extensions[extension]

  if (!mediaType) {
    throw new Error(`Unknown file extension: ${extension}`)
  }

  const parser = formats.parsers.get(mediaType)

  if (!parser) {
    throw new Error(`No parser available for media type: ${mediaType}`)
  }

  return parser.import(createReadStream(filename))
}

module.exports = fromFile
