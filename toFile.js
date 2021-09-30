const config = require('./defaults')
const formats = require('@rdfjs/formats-common')
const { createWriteStream } = require('fs')
const { extname } = require('path')
const { finished } = require('readable-stream')
const { promisify } = require('util')

function toFile (stream, filename, { extensions = config.extensions, ...options } = {}) {
  const extension = extname(filename).split('.').pop()
  const mediaType = extensions[extension]

  if (!mediaType) {
    throw new Error(`Unknown file extension: ${extension}`)
  }

  const serializer = formats.serializers.get(mediaType)

  if (!serializer) {
    throw new Error(`No serializer available for media type: ${mediaType}`)
  }

  const output = createWriteStream(filename)

  serializer.import(stream, options).pipe(output)

  return promisify(finished)(output)
}

module.exports = toFile
