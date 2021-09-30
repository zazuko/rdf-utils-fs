/* global describe, expect, it */

const example = require('./support/example')
const fromFile = require('../fromFile')
const { resolve } = require('path')
const rdf = require('@rdfjs/dataset')
const { equals, fromStream } = require('rdf-dataset-ext')

describe('fromFile', () => {
  it('should create a quad stream', async () => {
    const stream = fromFile(resolve(__dirname, 'support/example.nt'))
    const dataset = await fromStream(rdf.dataset(), stream)

    expect(equals(dataset, example()))
  })

  it('should forward options to parser', async () => {
    const stream = fromFile(resolve(__dirname, 'support/example.ttl'))
    const dataset = await fromStream(rdf.dataset(), stream, {
      baseIRI: 'http://example.org/'
    })

    expect(equals(dataset, example()))
  })

  it('should throw an error if the file extension is unknown', () => {
    expect(() => {
      fromFile('test.jpg')
    }).toThrow()
  })

  it('should throw an error if the media type is unknown', () => {
    expect(() => {
      fromFile('test.jpg', {
        extensions: {
          jpg: 'image/jpeg'
        }
      })
    }).toThrow()
  })
})
