import { strictEqual, throws } from 'assert'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import url from 'url'
import formats from '@rdfjs/formats'
import { create, DefaultEnv, DerivedEnvironment } from '@zazuko/env'
// eslint-disable-next-line import/default
import shell from 'shelljs'
import FsUtilsFactory from '../Factory.js'
import * as example from './support/example.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

describe('toFile', () => {
  shell.mkdir('-p', 'tmp')

  let env: DerivedEnvironment<DefaultEnv, FsUtilsFactory>
  before(() => {
    env = create(FsUtilsFactory)
    env.formats.import(formats)
  })

  it('should create a quad stream', async () => {
    const filename = 'tmp/test.nt'
    await env.toFile(example.defaultGraph().toStream(), filename)
    const content = readFileSync(filename).toString().trim()
    const expected = readFileSync(resolve(__dirname, 'support/example.nt')).toString().trim()

    strictEqual(content, expected)
  })

  it('should work with URL', async () => {
    const filename = new URL('file:tmp/test.nt')
    await env.toFile(example.defaultGraph().toStream(), filename)
    const content = readFileSync(filename).toString().trim()
    const expected = readFileSync(resolve(__dirname, 'support/example.nt')).toString().trim()

    strictEqual(content, expected)
  })

  it('should throw an error if the file extension is unknown', () => {
    throws(() => {
      env.toFile(example.defaultGraph().toStream(), 'test.jpg')
    })
  })

  it('should throw an error if the media type is unknown', () => {
    throws(() => {
      env.toFile(example.defaultGraph().toStream(), 'test.jpg', {
        extensions: {
          jpg: 'image/jpeg',
        },
      })
    })
  })
})
