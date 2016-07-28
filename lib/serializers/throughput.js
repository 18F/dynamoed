'use strict'

function throughput(customizations) {
  customizations = customizations || {}
  return Object.assign(
    {},
    throughput.defaults,
    serialize(customizations) || {}
  )
}

function serialize(customizations) {
  let serialized = {}

  if (customizations.read) {
    serialized.ReadCapacityUnits = customizations.read
  }

  if (customizations.write) {
    serialized.WriteCapacityUnits = customizations.write
  }

  return serialized
}

throughput.defaults = {
  ReadCapacityUnits: 1,
  WriteCapacityUnits: 1
}

module.exports = throughput
