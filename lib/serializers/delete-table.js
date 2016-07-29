'use strict'

module.exports = function deleteTable(name) {
  return {TableName: name}
}
