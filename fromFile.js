import { createReadStream } from 'fs'
import { extname } from 'path'
import defaults from './defaults.js'

export default function fromFile(env, filename, { extensions, ...options } = {}) {
  const combinedExtensions = {
    ...defaults.extensions,
    ...extensions,
  }

  const extension = extname(filename).split('.').pop()
  const mediaType = combinedExtensions[extension]

  if (!mediaType) {
    throw new Error(`Unknown file extension: ${extension}`)
  }

  const parser = env.formats.parsers.get(mediaType)

  if (!parser) {
    throw new Error(`No parser available for media type: ${mediaType}`)
  }

  return parser.import(createReadStream(filename), {
    ...options,
    factory: env,
    dataFactory: env
  })
}
