/* global describe, expect, it */

const fromFileTest = require('../fromFile')
const rdf = require('@rdfjs/dataset')
const { fromStream } = require('rdf-dataset-ext')

describe('fromFile', () => {
  it('should create a quad stream', async () => {
    const stream = fromFileTest(require.resolve('tbbt-ld/dist/tbbt.nt'))
    const dataset = await fromStream(rdf.dataset(), stream)
    const matches = dataset.match(null, rdf.namedNode('http://schema.org/jobTitle'), rdf.literal('neurobiologist'))

    expect(matches.size).toBe(1)
  })

  it('should throw an error if the file extension is unknown', () => {
    expect(() => {
      fromFileTest('test.jpg')
    }).toThrow()
  })

  it('should throw an error if the media type is unknown', () => {
    expect(() => {
      fromFileTest('test.jpg', {
        extensions: {
          jpg: 'image/jpeg'
        }
      })
    }).toThrow()
  })
})
