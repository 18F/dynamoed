'use strict'

const AWS           = require('aws-sdk')
const Promise       = require('bluebird')
AWS.config.setPromisesDependency(Promise)

const serialize     = require('./lib/serializers')
const parse         = require('./lib/parsers')

module.exports = function dynamoed(connectionParams) {
  const client = new AWS.DynamoDB(connectionParams)
  return () => { return new Wrapper(client) }
}

class Wrapper {
  constructor(client) {
    this.client = client
  }

  createTable(name, attributes) {
    let params = serialize.createTable(name, attributes)
    return this.client
      .createTable(params)
      .promise()
      .then(() => {
        return parse.table(params)
      })
  }

  deleteTable(name) {
    return this.client
      .deleteTable(serialize.deleteTable(name))
      .promise()
      .then((tableParams) => {
        return parse.table(tableParams.TableDescription)
      })
  }

  listTables() {
    return this.client
      .listTables()
      .promise()
      .then((names) => {
        return names.TableNames
      })
  }
}
