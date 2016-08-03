'use strict'

const assert    = require('assert')
const table = require('../../../lib/parsers/table')

describe('parser: table', () => {
  let response, parsed

  beforeEach(() => {
    response = {
      "TableName": "users",
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 3,
        "WriteCapacityUnits": 1
      },
      "KeySchema": [
        {
          "AttributeName": "id",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "url",
          "KeyType": "RANGE"
        }
      ],
      "AttributeDefinitions": [
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
      ],
      "LocalSecondaryIndexes": [
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
          ]
        }
      ],
      "GlobalSecondaryIndexes": [
        {
          "IndexName": "users_something",
          "Projection": {
            "ProjectionType": "ALL"
          },
          "KeySchema": [
            {
              "AttributeName": "something",
              "KeyType": "HASH"
            }
          ],
          "ProvisionedThroughput": {
            "ReadCapacityUnits": 1,
            "WriteCapacityUnits": 1
          }
        }
      ]
    }

    parsed = table(response)
  })

  it('parses out the name', () =>  {
    assert.equal(parsed.name, 'users')
  })

  it('repackages the key with key types', () => {
    assert.deepEqual(parsed.key, [
      {id: 'number', type: 'hash'},
      {url: 'string', type: 'range'}
    ])
  })

  it('represents the throughput', () => {
    assert.deepEqual(parsed.throughput, {
      read: 3,
      write: 1
    })
  })

  it('repacks the local indexes', () => {
    assert.deepEqual(parsed.localIndexes, {
      users_username: {
        key: [
          {username: 'string', type: 'hash'},
          {url: 'string', type: 'range'}
        ],
        projection: 'all'
      }
    })
  })

  xit('repacks the global indexes', () => {
    assert.deepEqual(parsed.globalIndexes, {
      users_something: {
        key: [{something: 'string', type: 'hash'}],
        throughput: {
          read: 1,
          write: 1
        },
        projection: 'all'
      }
    })
  })
})
