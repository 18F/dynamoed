'use strict'

const keySchema   = require('./key-schema')
const throughput  = require('./throughput')

function globalIndexes(indexes) {
  return Object.keys(indexes).map((name) => {
    return {
      IndexName: name,
      Projection: { ProjectionType: 'ALL' },
      KeySchema: keySchema(indexes[name]),
      ProvisionedThroughput: throughput(indexes[name].throughput)
    }
  })
}

module.exports = globalIndexes
