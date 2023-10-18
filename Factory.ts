import { Environment } from '@rdfjs/environment/Environment.js'
import { FormatsFactory } from '@rdfjs/environment/FormatsFactory.js'
import { Stream } from '@rdfjs/types'
import { Readable } from 'readable-stream'
import fromFile, { FromFileArgs } from './fromFile.js'
import toFile, { ToFileArgs } from './toFile.js'

interface Factory {
  fromFile(...args: FromFileArgs): Stream & Readable
  toFile(...args: ToFileArgs): void
}

class Factory {
  init(this: Environment<Factory | FormatsFactory>) {
    this.fromFile = fromFile.bind(null, this)
    this.toFile = toFile.bind(null, this)
  }
}

export default Factory
