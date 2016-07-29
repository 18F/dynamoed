'use strict'

const throughput = require('./throughput')
const keySchema  = require('./key-schema')
const attributeDefinitions  = require('./attribute-definitions')

function createTable(name, attributes) {
  let params = {}

  params.TableName             = name
  params.ProvisionedThroughput = throughput(attributes.throughput)
  params.KeySchema             = keySchema(attributes.key)
  params.AttributeDefinitions  = attributeDefinitions(attributes.key)

  return params
}

module.exports = createTable
