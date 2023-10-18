import { createReadStream } from 'fs'
import { extname } from 'path'
import type { Environment } from '@rdfjs/environment/Environment.js'
import type { FormatsFactory } from '@rdfjs/environment/FormatsFactory.js'
import { Readable } from 'readable-stream'
import { Stream } from '@rdfjs/types'
import defaults from './defaults.js'

interface FromFileOpts extends Record<string, unknown> {
  extensions?: Record<string, string>
}
export type FromFileArgs = [string] | [string, FromFileOpts]

export default function fromFile(env: Environment<FormatsFactory>, ...[filename, { extensions = {}, ...options } = {}]: FromFileArgs): Stream & Readable {
  const combinedExtensions = {
    ...defaults.extensions,
    ...extensions,
  }

  const extension = extname(filename).split('.').pop()!
  const mediaType = combinedExtensions[extension]

  if (!mediaType) {
    throw new Error(`Unknown file extension: ${extension}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser: any = env.formats.parsers.get(mediaType)

  if (!parser) {
    throw new Error(`No parser available for media type: ${mediaType}`)
  }

  return parser.import(createReadStream(filename), {
    ...options,
    factory: env,
    dataFactory: env,
  })
}
