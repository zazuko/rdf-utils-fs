/* global describe, it */

const assert = require('assert')
const fromFile = require('../fromFile')
const rdf = require('rdf-ext')

describe('fromFile', () => {
  it('should create a quad stream', () => {
    const stream = fromFile(require.resolve('tbbt-ld/dist/tbbt.nt'))

    return rdf.dataset().import(stream).then((dataset) => {
      const matches = dataset.match(null, rdf.namedNode('http://schema.org/jobTitle'), rdf.literal('neurobiologist'))

      assert.equal(matches.length, 1)
    })
  })

  it('should return null if the file extension is unknown', () => {
    const stream = fromFile('test.jpg')

    assert(!stream)
  })

  it('should return null if the media type is unknown', () => {
    const stream = fromFile('test.jpg', {extensions: {
      jpg: 'image/jpeg'
    }})

    assert(!stream)
  })
})
