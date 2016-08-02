'use strict'

const throughput            = require('./throughput')
const keySchema             = require('./key-schema')
const localIndexes          = require('./local-indexes')
const globalIndexes         = require('./global-indexes')
const attributeDefinitions  = require('./attribute-definitions')

function createTable(name, attributes) {
  let params = {}

  params.TableName             = name
  params.ProvisionedThroughput = throughput(attributes.throughput)
  params.KeySchema             = keySchema(attributes.key)
  params.AttributeDefinitions  = attributeDefinitions(
    attributes.key,
    indexValues(attributes.localIndexes),
    indexValues(attributes.globalIndexes)
  )

  if (attributes.localIndexes) {
    params.LocalSecondaryIndexes = localIndexes(attributes.localIndexes)
  }

  if (attributes.globalIndexes) {
    params.GlobalSecondaryIndexes = globalIndexes(attributes.globalIndexes)
  }

  return params
}

function indexValues(indexAttributes) {
  if (!indexAttributes) { return [] }

  let keys = Object.keys(indexAttributes)
  let collection = []
  keys.forEach((key) => {
    indexAttributes[key].forEach((definition) => {
      collection.push(definition)
    })
  })
  return collection
}

module.exports = createTable


