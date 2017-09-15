const config = require('./defaults')
const defaults = require('lodash/defaults')
const formats = require('rdf-formats-common')()
const fs = require('fs')
const path = require('path')

function fromFile (filename, options) {
  options = options || {}

  const extensions = defaults(config.extensions, options.extensions)

  const extension = path.extname(filename).split('.').pop()
  const mediaType = extensions[extension]

  if (!mediaType) {
    return
  }

  const parser = formats.parsers.find(mediaType)

  if (!parser) {
    return
  }

  const input = fs.createReadStream(filename)

  return parser.import(input)
}

module.exports = fromFile
