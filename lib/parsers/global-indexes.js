'use strict'

const key = require('./key')
const throughput = require('./throughput')

module.exports = function globalIndexes(indexes, attributes) {
  let parsed = {}

  indexes.forEach((description) => {
    let parsedDescription         = parsed[description.IndexName] = {}
    parsedDescription.key         = key(description.KeySchema, attributes)
    parsedDescription.projection  = description.Projection.ProjectionType.toLowerCase()
    parsedDescription.throughput  = throughput(description.ProvisionedThroughput)
  })

  return parsed
}
