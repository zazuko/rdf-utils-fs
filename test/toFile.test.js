/* global describe, expect, it */

const example = require('./support/example')
const { readFileSync } = require('fs')
const { resolve } = require('path')
const { toStream } = require('rdf-dataset-ext')
const toFile = require('../toFile')

describe('toFile', () => {
  it('should be a function', () => {
    expect(typeof toFile).toBe('function')
  })

  it('should create a quad stream', async () => {
    const filename = 'tmp/test.nt'
    const stream = toStream(example())
    await toFile(stream, filename)
    const content = readFileSync(filename).toString().trim()
    const expected = readFileSync(resolve(__dirname, 'support/example.nt')).toString().trim()

    expect(content).toBe(expected)
  })

  it('should throw an error if the file extension is unknown', () => {
    const stream = toStream(example())

    expect(() => {
      toFile(stream, 'test.jpg')
    }).toThrow()
  })

  it('should throw an error if the media type is unknown', () => {
    const stream = toStream(example())

    expect(() => {
      toFile(stream, 'test.jpg', {
        extensions: {
          jpg: 'image/jpeg'
        }
      })
    }).toThrow()
  })
})
