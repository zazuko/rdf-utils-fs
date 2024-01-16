import { createReadStream } from 'fs'
import { extname } from 'path'
import url from 'url'
import type { Environment } from '@rdfjs/environment/Environment.js'
import type { FormatsFactory } from '@rdfjs/formats/Factory.js'
import { Readable } from 'readable-stream'
import type { Stream } from '@rdfjs/types'
import defaults from './defaults.js'

export interface FromFileOpts extends Record<string, unknown> {
  extensions?: Record<string, string>
  /**
   * Use the file path as base IRI
   */
  implicitBaseIRI?: boolean
}

export default function fromFile(env: Environment<FormatsFactory>, pathOrUrl: string | URL, { implicitBaseIRI, extensions = {}, ...options }: FromFileOpts = {}): Stream & Readable {
  const combinedExtensions = {
    ...defaults.extensions,
    ...extensions,
  }

  let baseIRI: string | undefined
  if (implicitBaseIRI) {
    baseIRI = typeof pathOrUrl === 'string' ? url.pathToFileURL(pathOrUrl).toString() : pathOrUrl.toString()
  }
  const filename = typeof pathOrUrl === 'string' ? pathOrUrl : url.fileURLToPath(pathOrUrl)
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
    baseIRI,
    ...options,
    factory: env,
    dataFactory: env,
  })
}
