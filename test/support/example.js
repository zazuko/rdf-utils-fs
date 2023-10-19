import rdf from '@zazuko/env'

export function defaultGraph() {
  return rdf.dataset([rdf.quad(
    rdf.namedNode('http://example.org/subject'),
    rdf.namedNode('http://example.org/predicate'),
    rdf.literal('object'),
  )])
}

export function namedGraph() {
  return rdf.dataset([rdf.quad(
    rdf.namedNode('http://example.org/subject'),
    rdf.namedNode('http://example.org/predicate'),
    rdf.literal('object'),
    rdf.namedNode('http://example.org/subject'),
  )])
}
