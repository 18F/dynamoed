'use strict'

module.exports = key

function key(keySchema, attributes) {
  return keySchema.map((keyDescription) => {
    return transformEach(keyDescription, attributes)
  })
}

function transformEach(keyDescription, attributes) {
  let parsed = {
    type: keyType(keyDescription)
  }
  parsed[name(keyDescription)] = dataType(name(keyDescription), attributes)
  return parsed
}

function name(keyDescription) {
  return keyDescription.AttributeName
}

function keyType(keyDescription) {
  return keyDescription.KeyType.toLowerCase()
}

function dataType(name, attributes) {
  return {
    B: 'binary',
    BOOL: 'boolean',
    N: 'number',
    S: 'string'
  }[awsDataType(name, attributes)]
}

function awsDataType(name, attributes) {
  return attributeSet(name, attributes).AttributeType
}

function attributeSet(name, attributes) {
  return attributes.find((set) => {
    return set.AttributeName === name
  })
}
