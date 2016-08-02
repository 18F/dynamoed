'use strict'

const extractName = require('./extract-name')

module.exports = combinedAttributes

function combinedAttributes() {
  let collections = Array.prototype.slice.call(arguments)
  collections  = collections.map((collection) => { return attributes(collection) })
  return dedup(collections)
}

function attributes(collection) {
  if (!collection) { return [] }
  return collection.map((keyDescription) => {
    let name = extractName(keyDescription)
    let value = keyDescription[name]
    return {
      AttributeName: name,
      AttributeType: valueType(value)
    }
  })
}

function dedup(collections) {
  let aggregated = []

  collections.forEach((collection) => {
    collection.forEach((definition) => {
      if (!find(aggregated, definition.AttributeName)) {
        aggregated.push(definition)
      }
    })
  })

  return aggregated
}

function find(aggregated, name) {
  return aggregated.find((definition) => {
    return definition.AttributeName === name
  })
}

function valueType(value) {
  return {
    binary: 'B',
    boolean: 'BOOL',
    number: 'N',
    string: 'S'
  }[value] || value
}
