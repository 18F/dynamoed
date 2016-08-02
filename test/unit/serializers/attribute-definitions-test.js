'use strict'

const assert                = require('assert')
const attributeDefinitions  = require('../../../lib/serializers/attribute-definitions')

describe('serializer: attributeDefinitions', () => {
  it('combines all the key information', () => {
    let params = attributeDefinitions([
      {id: 'number'}, {url: 'string'}], [
      {username: 'string'}, {url: 'string'}
    ])

    assert.deepEqual(params, [
      { AttributeName: 'id', AttributeType: 'N' },
      { AttributeName: 'url', AttributeType: 'S' },
      { AttributeName: 'username', AttributeType: 'S' },
    ])
  })
})
