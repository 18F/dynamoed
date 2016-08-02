'use strict'

const keySchema = require('./key-schema')

function localIndexes(indexes) {
  return Object.keys(indexes).map((name) => {
    return {
      IndexName: name,
      Projection: { ProjectionType: 'ALL' },
      KeySchema: keySchema(indexes[name])
    }
  })
}

module.exports = localIndexes
