'use strict'

const throughput    = require('./throughput')
const key           = require('./key')
const localIndexes  = require('./local-indexes')

function table(response) {
  let attributes = {}
  attributes.name        = response.TableName
  attributes.throughput  = throughput(response.ProvisionedThroughput)
  attributes.key         = key(response.KeySchema, response.AttributeDefinitions)

  if (response.LocalSecondaryIndexes) {
    attributes.localIndexes = localIndexes(response.LocalSecondaryIndexes, response.AttributeDefinitions)
  }

  return attributes
}

module.exports = table
