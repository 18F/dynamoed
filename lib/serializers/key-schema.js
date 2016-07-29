'use strict'

const extractName = require('./extract-name')

module.exports = keySchema

function keySchema(collection) {
  let params = collection.map(toParam)
  params.sort(sortByType)
  return params
}

function toParam(keyDescription, index) {
  return {
    AttributeName: extractName(keyDescription),
    KeyType: getKeyType(keyDescription, index)
  }
}

function getKeyType(keyDescription, index) {
  let type = keyDescription.type || inferKeyType(index)
  return type.toUpperCase()
}

function sortByType(a, b) {
  return a.KeyType < b.KeyType ? -1 : 1
}

function inferKeyType(index) {
  return index === 0 ? 'HASH' : 'RANGE'
}

