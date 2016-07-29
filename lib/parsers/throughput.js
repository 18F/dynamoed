'use strict'

const defaults = require('../serializers/throughput').defaults;

function throughput(response) {
  var provisioned = Object.assign({}, defaults, response)

  return {
    read: provisioned.ReadCapacityUnits,
    write: provisioned.WriteCapacityUnits
  }
}

module.exports = throughput
