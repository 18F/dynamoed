'use strict'

const assert    = require('assert')

const keyParser = require('../../../lib/parsers/key')

describe('parser: key', () => {
  it('converts to easier to understand format', function() {
    let keySchema = [
      {AttributeName: 'id', KeyType: 'HASH'},
      {AttributeName: 'username', KeyType: 'RANGE'}
    ]

    let attributes = [
      {
        AttributeName: 'id',
        AttributeType: 'N',
      },
      {
        AttributeName: 'username',
        AttributeType: 'S'
      }
    ]

    let parsed = keyParser(keySchema, attributes)

    assert.deepEqual(parsed, [
      {id: 'number', type: 'hash'},
      {username: 'string', type: 'range'}
    ])
  })
})

