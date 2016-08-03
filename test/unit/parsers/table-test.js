'use strict'

const assert    = require('assert')
const table = require('../../../lib/parsers/table')

describe('parser: table', () => {
  let response, parsed

  beforeEach(() => {
    response = {
      "TableName": "users",
      "TableStatus": 'ACTIVE',
      "CreationDateTime": new Date('Wed Aug 03 2016 08:47:34 GMT-0700 (PDT)'),
      "ProvisionedThroughput": {
         "LastIncreaseDateTime": new Date('Wed Dec 31 1969 16:00:00 GMT-0800 (PST)'),
         "LastDecreaseDateTime": new Date('Wed Dec 31 1969 16:00:00 GMT-0800 (PST)'),
         "NumberOfDecreasesToday": 0,
         "ReadCapacityUnits": 3,
         "WriteCapacityUnits": 1
      },
      "TableSizeBytes": 42,
      "ItemCount": 1,
      "TableArn": 'arn:aws:dynamodb:ddblocal:000000000000:table/users',
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

  it('repacks the global indexes', () => {
    assert.deepEqual(parsed.globalIndexes, {
      users_something: {
        key: [{something: 'number', type: 'hash'}],
        throughput: {
          read: 1,
          write: 1
        },
        projection: 'all'
      }
    })
  })

  it('includes the status', () => {
    assert.equal(parsed.status, 'active')
  })

  it('includes created at date', () => {
    assert.equal(parsed.createdAt, response.CreationDateTime)
  })

  it('includes the size of the table in bytes', () => {
    assert.equal(parsed.size, 42)
  })

  it('includes the record count', () => {
    assert.equal(parsed.count, 1)
  })

  it('includes the table id', () => {
    assert.equal(parsed.id, response.TableArn)
  })
})
