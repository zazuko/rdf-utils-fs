import { strictEqual, throws } from 'assert'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import url from 'url'
import formats from '@rdfjs/formats-common'
import { create } from '@zazuko/env'
import { describe, it, before } from 'mocha'
import toStream from 'rdf-dataset-ext/toStream.js'
import shell from 'shelljs'
import Factory from '../Factory.js'
import * as example from './support/example.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

describe('toFile', () => {
  shell.mkdir('-p', 'tmp')

  let env
  before(() => {
    env = create(Factory)
    env.formats.import(formats)
  })

  it('should create a quad stream', async () => {
    const filename = 'tmp/test.nt'
    await env.toFile(toStream(example.defaultGraph()), filename)
    const content = readFileSync(filename).toString().trim()
    const expected = readFileSync(resolve(__dirname, 'support/example.nt')).toString().trim()

    strictEqual(content, expected)
  })

  it('should throw an error if the file extension is unknown', () => {
    throws(() => {
      env.toFile(toStream(example.defaultGraph()), 'test.jpg')
    })
  })

  it('should throw an error if the media type is unknown', () => {
    throws(() => {
      env.toFile(toStream(example.defaultGraph()), 'test.jpg', {
        extensions: {
          jpg: 'image/jpeg',
        },
      })
    })
  })
})
