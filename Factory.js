import fromFile from './fromFile.js'
import toFile from './toFile.js'

export default class {
  init () {
    this.fromFile = fromFile.bind(null, this)
    this.toFile = toFile.bind(null, this)
  }
}
