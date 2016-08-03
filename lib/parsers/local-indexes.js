'use strict'

const key = require('./key')

module.exports = function localIndexes(indexes, attributes) {
  return new LocalIndexes(indexes, attributes).parse()
}

class LocalIndexes {
  constructor(indexes, attributes) {
    this.indexes = indexes
    this.attributes = attributes
    this.parsed = {}
  }

  parse() {
    this.indexes.forEach((description) => {
      let parsedDescription = this.parsed[description.IndexName] = {}
      parsedDescription.key = key(description.KeySchema, this.attributes)
      parsedDescription.projection = description.Projection.ProjectionType.toLowerCase()
    })

    return this.parsed
  }
}
