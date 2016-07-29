'use strict'

const AWS     = require('aws-sdk')
const Promise = require('bluebird')
AWS.config.setPromisesDependency(Promise)

const serializers = require('./lib/serializers')

const keySchema   = serializers.keySchema
const throughput  = serializers.throughput
const attributeDefinitions  = serializers.attributeDefinitions

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
  }

  serialize() {
    let params = {}

    params.TableName             = this.name
    params.ProvisionedThroughput = throughput(this.attributes.throughput)
    params.KeySchema             = keySchema(this.attributes.key)
    params.AttributeDefinitions  = attributeDefinitions(this.attributes.key)

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
