'use strict'

const assert              = require('assert')
const throughputDefaults  = require('../../../lib/serializers/throughput').defaults
const createTable         = require('../../../lib/serializers/create-table')

describe('serializer: createTable', () => {
  let attributes, params

  beforeEach(() => {
    attributes = {
      key: [{id: 'number'}, {url: 'string'}],
      throughput: {read: 3},
      localIndexes: {
        users_username: [
          {username: 'string'},
          {url: 'string'}
        ]
      },
      globalIndexes: {
        users_something: [
          {something: 'number'}
        ]
      }
    }
  })

  it('serializes the table name', () => {
    params = createTable('users', attributes)
    assert.equal(params.TableName, 'users')
  })

  it('builds keys with an inferred type', () => {
    params = createTable('users', attributes)
    assert.deepEqual(params.KeySchema, [
      {AttributeName: 'id', KeyType: 'HASH'},
      {AttributeName: 'url', KeyType: 'RANGE'}
    ])
  })

  it('uses the key type if provided', () => {
    attributes.key = [
      {url: 'string', type: 'range'},
      {id: 'number', type: 'hash'}
    ]
    params = createTable('users', attributes)
    assert.deepEqual(params.KeySchema, [
      {AttributeName: 'id', KeyType: 'HASH'},
      {AttributeName: 'url', KeyType: 'RANGE'}
    ])
  })

  it('serialized key attributes', () => {
    delete attributes.localIndexes
    delete attributes.globalIndexes
    params = createTable('users', attributes)
    assert.deepEqual(params.AttributeDefinitions, [
      {
        AttributeName: 'id',
        AttributeType: 'N'
      },
      {
        AttributeName: 'url',
        AttributeType: 'S'
      }
    ])
  })

  it('combines defaults with customized throughput values', () => {
    params = createTable('users', attributes)
    assert.deepEqual(params.ProvisionedThroughput, {
      ReadCapacityUnits: 3,
      WriteCapacityUnits: throughputDefaults.WriteCapacityUnits
    })
  })

  it('creates local indexes correctly', () => {
    params = createTable('users', attributes)
    assert.deepEqual(params.LocalSecondaryIndexes, [
      {
        IndexName: 'users_username',
        KeySchema: [
          { AttributeName: 'username', KeyType: 'HASH' },
          { AttributeName: 'url', KeyType: 'RANGE'}
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ])
  })

  it('combines attributes for key and local indexes', function() {
    delete attributes.globalIndexes
    params = createTable('users', attributes)
    assert.deepEqual(params.AttributeDefinitions, [
      { AttributeName: 'id', AttributeType: 'N' },
      { AttributeName: 'url', AttributeType: 'S' },
      { AttributeName: 'username', AttributeType: 'S' }
    ])
  })

  it('creates global indexes correctly', () => {
    params = createTable('users', attributes)
    assert.deepEqual(params.GlobalSecondaryIndexes, [
      {
        IndexName: 'users_something',
        KeySchema: [
          { AttributeName: 'something', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: throughputDefaults.ReadCapacityUnits,
          WriteCapacityUnits: throughputDefaults.WriteCapacityUnits
        }
      }
    ])
  })

  it('combines attributes for key, local and global indexes', function() {
    params = createTable('users', attributes)
    assert.deepEqual(params.AttributeDefinitions, [
      { AttributeName: 'id', AttributeType: 'N' },
      { AttributeName: 'url', AttributeType: 'S' },
      { AttributeName: 'username', AttributeType: 'S' },
      { AttributeName: 'something', AttributeType: 'N' }
    ])
  })
})

