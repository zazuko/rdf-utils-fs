import { createWriteStream } from 'fs'
import { extname } from 'path'
import { promisify } from 'util'
import { finished } from 'readable-stream'
import type { Stream } from '@rdfjs/types'
import type { Environment } from '@rdfjs/environment/Environment.js'
import type { FormatsFactory } from '@rdfjs/environment/FormatsFactory.js'
import config from './defaults.js'

interface ToFileOpts extends Record<string, unknown> {
  extensions?: Record<string, string>
}
export type ToFileArgs = [Stream, string, ToFileOpts] | [Stream, string]

export default function toFile(env: Environment<FormatsFactory>, ...[stream, filename, { extensions = config.extensions, ...options } = {}]: ToFileArgs) {
  const extension = extname(filename).split('.').pop()!
  const mediaType = extensions[extension]

  if (!mediaType) {
    throw new Error(`Unknown file extension: ${extension}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializer: any = env.formats.serializers.get(mediaType)

  if (!serializer) {
    throw new Error(`No serializer available for media type: ${mediaType}`)
  }

  const output = createWriteStream(filename)

  serializer.import(stream, options).pipe(output)

  return promisify(finished)(output)
}
