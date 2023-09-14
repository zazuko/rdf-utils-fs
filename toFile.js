import { createWriteStream } from 'fs'
import { extname } from 'path'
import { promisify } from 'util'
import { finished } from 'readable-stream'
import config from './defaults.js'

export default function toFile(env, stream, filename, { extensions = config.extensions, ...options } = {}) {
  const extension = extname(filename).split('.').pop()
  const mediaType = extensions[extension]

  if (!mediaType) {
    throw new Error(`Unknown file extension: ${extension}`)
  }

  const serializer = env.formats.serializers.get(mediaType)

  if (!serializer) {
    throw new Error(`No serializer available for media type: ${mediaType}`)
  }

  const output = createWriteStream(filename)

  serializer.import(stream, options).pipe(output)

  return promisify(finished)(output)
}
