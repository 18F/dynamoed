'use strict'

const throughput    = require('./throughput')
const key           = require('./key')
const localIndexes  = require('./local-indexes')
const globalIndexes = require('./global-indexes')

function table(response) {
  let attributes = {}
  attributes.name        = response.TableName
  attributes.throughput  = throughput(response.ProvisionedThroughput)
  attributes.key         = key(response.KeySchema, response.AttributeDefinitions)

  if (response.LocalSecondaryIndexes) {
    attributes.localIndexes = localIndexes(response.LocalSecondaryIndexes, response.AttributeDefinitions)
  }

  if (response.GlobalSecondaryIndexes) {
    attributes.globalIndexes = globalIndexes(response.GlobalSecondaryIndexes, response.AttributeDefinitions)
  }

  if (response.TableStatus) {
    attributes.status = response.TableStatus.toLowerCase()
  }

  if (response.CreationDateTime) {
    attributes.createdAt = response.CreationDateTime
  }

  if (response.TableSizeBytes) {
    attributes.size = response.TableSizeBytes
  }

  if (response.ItemCount) {
    attributes.count = response.ItemCount
  }

  if (response.TableArn) {
    attributes.id = response.TableArn
  }

  return attributes
}

module.exports = table
