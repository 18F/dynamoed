'use strict'

const fs     = require('fs');
const path   = require('path');
const _      = require('lodash');

module.exports = function exportDirectory(base) {
  var directory = path.resolve(path.dirname(base.filename))
  var paths = fs.readdirSync(directory)

  paths.forEach((filePath) => {
    var key = path.basename(filePath, '.js')
    key = _.camelCase(key)
    if (key !== 'index') {
      base.exports[key] = require(path.resolve(directory, filePath))
    }
  })
}




