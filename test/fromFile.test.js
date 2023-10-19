import { strictEqual, throws } from 'assert'
import { resolve } from 'path'
import url from 'url'
import formats from '@rdfjs/formats-common'
import { create } from '@zazuko/env'
import { isReadableStream as isReadable } from 'is-stream'
import { before, describe, it } from 'mocha'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import Factory from '../Factory.js'
import * as example from './support/example.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

describe('fromFile', () => {
  let env
  before(() => {
    env = create(Factory)
    env.formats.import(formats)
  })

  it('should create a quad stream', async () => {
    const stream = env.fromFile(resolve(__dirname, 'support/example.nt'))

    stream.resume()

    strictEqual(isReadable(stream), true)
  })

  it('should forward options to parser', async () => {
    const stream = env.fromFile(resolve(__dirname, 'support/example.ttl'), { baseIRI: 'http://example.org/' })
    const dataset = await fromStream(env.dataset(), stream)

    strictEqual(toCanonical(dataset), toCanonical(example.defaultGraph()))
  })

  it('should combine extensions with default', async () => {
    const extensions = {
      trig: 'application/trig',
    }

    const stream = env.fromFile(resolve(__dirname, 'support/example.nt'), { extensions })
    const dataset = await fromStream(env.dataset(), stream)

    strictEqual(toCanonical(dataset), toCanonical(example.defaultGraph()))
  })

  const commonExtensions = [
    ['json', example.defaultGraph],
    ['jsonld', example.namedGraph],
    ['n3', example.defaultGraph],
    ['trig', example.namedGraph],
    ['nq', example.namedGraph],
  ]
  for (const [extension, expected] of commonExtensions) {
    it(`should load ${extension} out of the box`, async () => {
      const stream = env.fromFile(resolve(__dirname, `support/example.${extension}`))
      const dataset = await fromStream(env.dataset(), stream)

      strictEqual(toCanonical(dataset), toCanonical(expected()))
    })
  }

  it('should throw an error if the file extension is unknown', () => {
    throws(() => {
      env.fromFile('test.jpg')
    })
  })

  it('should throw an error if the media type is unknown', () => {
    throws(() => {
      env.fromFile('test.jpg', {
        extensions: {
          jpg: 'image/jpeg',
        },
      })
    })
  })
})
