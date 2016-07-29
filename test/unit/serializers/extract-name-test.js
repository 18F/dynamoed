'use strict'

const assert    = require('assert')

const extractName = require('../../../lib/serializers/extract-name')

describe('extractName', () => {
  let description, serialized

  it('chooses the first non-type key', () => {
    description = {
      type: 'hash', id: 'string'
    }

    serialized = extractName(description)

    assert.equal(serialized, 'id')
  })

  it('chooses "type" when only one key provided', () => {
    description = {
     type: 'string'
    }

    serialized = extractName(description)

    assert.equal(serialized, 'type')
  })
})

