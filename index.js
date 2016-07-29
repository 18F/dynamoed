'use strict'

const AWS           = require('aws-sdk')
const Promise       = require('bluebird')
AWS.config.setPromisesDependency(Promise)

const serializers   = require('./lib/serializers')
const parsers       = require('./lib/parsers')

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
    params.ProvisionedThroughput = serializers.throughput(this.attributes.throughput)
    params.KeySchema             = serializers.keySchema(this.attributes.key)
    params.AttributeDefinitions  = serializers.attributeDefinitions(this.attributes.key)

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
    attributes.key         = parsers.key(this.params.KeySchema, this.params.AttributeDefinitions)

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
}
