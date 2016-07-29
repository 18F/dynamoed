'use strict'

const extractName = require('./extract-name')

module.exports = attributes

function attributes(collection) {
  return collection.map((keyDescription) => {
    let name = extractName(keyDescription)
    let value = keyDescription[name]
    return {
      AttributeName: name,
      AttributeType: valueType(value)
    }
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
