'use strict'

const key = require('./key')

module.exports = function localIndexes(indexes, attributes) {
  let parsed = {}

  indexes.forEach((description) => {
    let parsedDescription = parsed[description.IndexName] = {}
    parsedDescription.key = key(description.KeySchema, attributes)
    parsedDescription.projection = description.Projection.ProjectionType.toLowerCase()
  })

  return parsed
}
