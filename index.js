'use strict'

const AWS     = require('aws-sdk')
const Promise = require('bluebird')

AWS.config.setPromisesDependency(Promise);

module.exports = function dynamoed(connectionParams) {
  const client = new AWS.DynamoDB(connectionParams)
  return () => { return new Wrapper(client) }
}

class Wrapper {
  constructor(client) {
    this.client = client
  }

  createTable(name, attributes) {
    let params = new CreateTableParams(name, attributes).serialize()
    return this.client
      .createTable(params)
      .promise()
      .then(() => {
        return new TableAttributes(params).parse()
      })
  }

  deleteTable(name) {
    return this.client
      .deleteTable({TableName: name})
      .promise()
      .then((tableParams) => {
        return new TableAttributes(tableParams).parse()
      })
  }
}

class CreateTableParams {
  constructor(name, attributes) {
    this.name = name
    this.attributes = attributes
    this.params = {}
  }

  serialize() {
    this.params.TableName             = this.name
    this.params.ProvisionedThroughput = this.provisionedThroughput()
    this.params.KeySchema             = this.keySchema()
    this.params.AttributeDefinitions  = this.attributeDefinitions()

    return this.params
  }

  provisionedThroughput() {
    return Object.assign(
      {},
      this.defaultProvisionedThroughput(),
      this.customizedThroughput()
    )
  }

  keySchema() {
    let params = []
    this.attributes.key.map((keyDescription, index) => {
      let name = Object.keys(keyDescription)[0];
      let keyType = keyDescription.type || typeForIndex(index)
      let keyParam = {
        AttributeName: name,
        KeyType: keyType.toUpperCase()
      }
      params.push(keyParam)
    })
    params.sort((a, b) => {
      return a.KeyType < b.KeyType ? -1 : 1
    })
    return params
  }

  attributeDefinitions() {
    let params = []
    this.attributes.key.map((keyDescription) => {
      let name = Object.keys(keyDescription)[0]
      let type = typeForValue(keyDescription[name])
      let attributeParam = {
        AttributeName: name,
        AttributeType: type
      }
      params.push(attributeParam)
    })
    return params
  }

  defaultProvisionedThroughput() {
    return {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }

  customizedThroughput() {
    let attributes = this.attributes.throughput || {}
    let params = {}
    if ( attributes.read) {
      params.ReadCapacityUnits = attributes.read
    }
    if (attributes.write) {
      params.WriteCapacityUnits = attributes.write
    }
    return params
  }
}

class TableAttributes {
  constructor(params) {
    this.params = params
  }

  parse() {
    let attributes = {}
    attributes.name        = this.name()
    attributes.throughput  = this.throughput()
    attributes.key         = this.key()

    return attributes
  }

  name() {
    return this.params.TableName
  }

  throughput() {
    var provisioned = this.params.ProvisionedThroughput || {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }

    return {
      read: provisioned.ReadCapacityUnits,
      write: provisioned.WriteCapacityUnits
    }
  }

  key() {
    let key = []
    let schema = this.params.KeySchema || []
    schema.forEach((keyDescription) => {
      let name = keyDescription.AttributeName
      let keyType = keyDescription.KeyType.toLowerCase()
      let repackaged = {type: keyType}
      let dataType = this.typeOf(name)
      repackaged[name] = dataType
      key.push(repackaged)
    })
    return key
  }

  typeOf(name) {
    let description = this.params.AttributeDefinitions.find((attributeDescription) => {
      return attributeDescription.AttributeName === name
    })
    let awsType = description && description.AttributeType
    return {
      B: 'binary',
      BOOL: 'boolean',
      N: 'number',
      S: 'string'
    }[awsType] || awsType
  }
}

function typeForIndex(index) {
  return index === 0 ? 'HASH' : 'RANGE'
}

function typeForValue(value) {
  return {
    binary: 'B',
    boolean: 'BOOL',
    number: 'N',
    string: 'S'
  }[value] || value
}
