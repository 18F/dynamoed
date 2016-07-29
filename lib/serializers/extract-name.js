'use strict'

module.exports = function extractName(keyDescription) {
  return new Extract(keyDescription).name()
}

class Extract {
  constructor(keyDescription) {
    this.keys = Object.keys(keyDescription)
  }

  name() {
    return this.onlyName() || this.bestName()
  }

  onlyName() {
    if ( this.keys.length > 1 ) { return }
    return this.keys[0]
  }

  bestName() {
    return this.keys.find((item) => {
      return item !== 'type'
    })
  }
}
