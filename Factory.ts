import type { Environment } from '@rdfjs/environment/Environment.js'
import type { FormatsFactory } from '@rdfjs/environment/FormatsFactory.js'
import type { Stream } from '@rdfjs/types'
import { Readable } from 'readable-stream'
import fromFile, { FromFileOpts } from './fromFile.js'
import toFile, { ToFileOpts } from './toFile.js'

interface FromFile {
  (filename: string, opts?: FromFileOpts): Stream & Readable
}

interface ToFile {
  (stream: Stream, filename: string, opts?: ToFileOpts): void
}

interface Factory {
  fromFile: FromFile
  toFile: ToFile
}

export default class FsUtilsFactory implements Factory {
  fromFile!: FromFile
  toFile!: ToFile

  init(this: Environment<Factory | FormatsFactory>) {
    this.fromFile = fromFile.bind(null, this)
    this.toFile = toFile.bind(null, this)
  }
}
