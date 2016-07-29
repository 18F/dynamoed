'use strict'

const throughput  = require('./throughput')
const key         = require('./key')

function table(response) {
  let attributes = {}
  attributes.name        = response.TableName
  attributes.throughput  = throughput(response.ProvisionedThroughput)
  attributes.key         = key(response.KeySchema, response.AttributeDefinitions)

  return attributes
}

module.exports = table
