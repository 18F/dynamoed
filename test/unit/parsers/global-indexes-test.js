'use strict'

const assert        = require('assert')
const globalIndexes = require('../../../lib/parsers/global-indexes')

describe('parser: localIndexes', () => {
  let attributeDefinitions, indexes, parsed

  beforeEach(() => {
    attributeDefinitions = [
      {
        "AttributeName": "id",
        "AttributeType": "N"
      },
      {
        "AttributeName": "url",
        "AttributeType": "S"
      },
      {
        "AttributeName": "username",
        "AttributeType": "S"
      },
      {
        "AttributeName": "something",
        "AttributeType": "N"
      }
    ]

    indexes = [
      {
        "IndexName": "users_username",
        "Projection": {
          "ProjectionType": "ALL"
        },
        "KeySchema": [
          {
            "AttributeName": "username",
            "KeyType": "HASH"
          },
          {
            "AttributeName": "url",
            "KeyType": "RANGE"
          }
        ],
        "ProvisionedThroughput": {
          "WriteCapacityUnits": 3,
          "ReadCapacityUnits": 1
        }
      }
    ]

    parsed = globalIndexes(indexes, attributeDefinitions)
  })

  it('repacks the key data under the name as a key', () => {
    assert.deepEqual(parsed.users_username.key,[
      {username: 'string', type: 'hash'},
      {url: 'string', type: 'range'}
    ])
  })

  it('adds projection data', () => {
    assert.deepEqual(parsed.users_username.projection, 'all')
  })

  it('adds throughput data', () => {
    assert.deepEqual(parsed.users_username.throughput, {
      read: 1,
      write: 3
    })
  })
})
