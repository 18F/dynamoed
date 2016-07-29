'use strict'

const assert    = require('assert')

const throughput = require('../../../lib/parsers/throughput')
const defaultThroughput = require('../../../lib/serializers/throughput').defaults

describe('parser: throughput', () => {
  it('will use default values if not enough provided', function() {
    let response = {
      ReadCapacityUnits: 4
    }

    let parsed = throughput(response)

    assert.equal(parsed.read, 4)
    assert.equal(parsed.write, defaultThroughput.WriteCapacityUnits)
  })
})
