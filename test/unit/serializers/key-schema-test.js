'use strict'

const assert    = require('assert')

const keySchema = require('../../../lib/serializers/key-schema')

describe('keySchema', () => {
  let description, serialized

  it('comes up with default types', () => {
    description = [
      {id: 'number'},
      {username: 'string'}
    ]

    serialized = keySchema(description)

    assert.equal(serialized[0].AttributeName, 'id')
    assert.equal(serialized[0].KeyType, 'HASH')
    assert.equal(serialized[1].AttributeName, 'username')
    assert.equal(serialized[1].KeyType, 'RANGE')
  })

  it('sorts to put the hash key first', () => {
    description = [
      {username: 'string', type: 'range'},
      {id: 'number', type: 'hash'}
    ]

    serialized = keySchema(description)

    assert.equal(serialized[0].AttributeName, 'id')
    assert.equal(serialized[0].KeyType, 'HASH')
    assert.equal(serialized[1].AttributeName, 'username')
    assert.equal(serialized[1].KeyType, 'RANGE')
  })
})
