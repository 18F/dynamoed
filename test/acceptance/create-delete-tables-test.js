'use strict'

const assert            = require('assert')
const config            = require('../../index')
const connectionParams  = require('../support/connection-params')

let dynamoed            = config(connectionParams)

describe('Acceptance: create, update and delete tables', () => {
  beforeEach((done) => {
    dynamoed()
      .deleteTable('users')
      .then((r) =>  { done() })
      .catch((e) => { done() })
  })

  describe('createTable(name, options)', () => {
    it('has works with a complex schema', (done) => {
      dynamoed()
        .createTable('users', {
          key: [{id: 'string'}, {username: 'string'}]
        })
        .then((table) => {
          assert.equal(table.name, 'users')
          done()
        })
        .catch(done)
    })
  })
})
