'use strict'

module.exports = keySchema

function keySchema(collection) {
  let params = collection.map(toKeyParam)
  params.sort(sortByType)
  return params
}

function toKeyParam(keyDescription, index) {
  return {
    AttributeName: extractName(keyDescription),
    KeyType: getKeyType(keyDescription, index)
  }
}

function sortByType(a, b) {
  return a.KeyType < b.KeyType ? -1 : 1
}

function extractName(keyDescription) {
  return Object.keys(keyDescription)[0];
}

function getKeyType(keyDescription, index) {
  let type = keyDescription.type || inferKeyType(index)
  return type.toUpperCase()
}

function inferKeyType(index) {
  return index === 0 ? 'HASH' : 'RANGE'
}

