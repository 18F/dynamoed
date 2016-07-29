'use strict'

const assert      = require('assert')
const throughput  = require('../../../lib/serializers/throughput')

describe('serializer: throughput', () => {
  let serialized

  describe('without customization', () => {
    it('uses the defaults', () => {
      serialized = throughput()
      assert.deepEqual(serialized, throughput.defaults)
    })

    it('uses the overridden defaults', () => {
      throughput.defaults.ReadCapacityUnits = 3
      serialized = throughput()
      assert.equal(serialized.ReadCapacityUnits, 3)
    })

    it('overrides defaults with customization', () => {
      serialized = throughput({write: 2})
      assert.equal(serialized.WriteCapacityUnits, 2)
    })
  })
})
