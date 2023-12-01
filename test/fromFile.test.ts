import { strictEqual, throws } from 'assert'
import { resolve } from 'path'
import url from 'url'
import formats from '@rdfjs/formats-common'
import { create, DefaultEnv, DerivedEnvironment } from '@zazuko/env'
import { isReadableStream as isReadable } from 'is-stream'
import { Dataset } from '@zazuko/env/lib/Dataset.js'
import Factory from '../Factory.js'
import * as example from './support/example.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

describe('fromFile', () => {
  let env: DerivedEnvironment<DefaultEnv, Factory>
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
    const dataset = await env.dataset().import(stream)

    strictEqual(dataset.toCanonical(), example.defaultGraph().toCanonical())
  })

  it('should work with URL argument', async () => {
    const path = new URL('support/example.ttl', import.meta.url)
    const stream = env.fromFile(path, { baseIRI: 'http://example.org/' })
    const dataset = await env.dataset().import(stream)

    strictEqual(dataset.toCanonical(), example.defaultGraph().toCanonical())
  })

  it('should combine extensions with default', async () => {
    const extensions = {
      trig: 'application/trig',
    }

    const stream = env.fromFile(resolve(__dirname, 'support/example.nt'), { extensions })
    const dataset = await env.dataset().import(stream)

    strictEqual(dataset.toCanonical(), example.defaultGraph().toCanonical())
  })

  it('should handle relative IRIs', async () => {
    const extensions = {
      trig: 'application/trig',
    }

    const stream = env.fromFile(
      resolve(__dirname, 'support/relative.ttl'),
      { extensions, implicitBaseIRI: true },
    )
    const dataset = await env.dataset().import(stream)
    const ptr = env.clownface({ dataset }).has(env.ns.rdf.type)

    strictEqual(ptr.value, 'file://' + resolve(__dirname, 'support/relative.ttl'))
  })

  const commonExtensions: [string, () => Dataset][] = [
    ['json', example.defaultGraph],
    ['jsonld', example.namedGraph],
    ['n3', example.defaultGraph],
    ['trig', example.namedGraph],
    ['nq', example.namedGraph],
  ]
  for (const [extension, expected] of commonExtensions) {
    it(`should load ${extension} out of the box`, async () => {
      const stream = env.fromFile(resolve(__dirname, `support/example.${extension}`))
      const dataset = await env.dataset().import(stream)

      strictEqual(dataset.toCanonical(), expected().toCanonical())
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
