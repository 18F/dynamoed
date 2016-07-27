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

  describe('basic attributes', () => {
    it('has a name', (done) => {
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

    it('defaults to the right type for keys', (done) => {
      dynamoed()
        .createTable('users', {
          key: [{id: 'string'}, {username: 'string'}]
        })
        .then((table) => {
          assert.deepEqual(table.key, [
            {id: 'string', type: 'hash'},
            {username: 'string', type: 'range'}
          ])
          done()
        })
        .catch(done)
    })

    it('uses types for keys when provided', function(done) {
      dynamoed()
        .createTable('users', {
          key: [{username: 'string', type: 'range'}, {id: 'string', type: 'hash'}]
        })
        .then((table) => {
          assert.deepEqual(table.key, [
            {id: 'string', type: 'hash'},
            {username: 'string', type: 'range'}
          ])
          done()
        })
        .catch(done)
    })
  })

  describe('throughput', () => {
    it('should create a table with default', (done) => {
      dynamoed()
        .createTable('users', {
          key: [{id: 'string'}, {username: 'string'}]
        })
        .then((table) => {
          assert.equal(table.throughput.read, 1)
          assert.equal(table.throughput.write, 1)
          done()
        })
        .catch(done)
    })

    it('should customizations', (done) => {
      dynamoed()
        .createTable('users', {
          key: [{id: 'string'}, {username: 'string'}],
          throughput: {
            read: 3
          }
        })
        .then((table) => {
          assert.equal(table.throughput.read, 3)
          assert.equal(table.throughput.write, 1)
          done()
        })
        .catch(done)
    })
  })

  //dynamoed()
  //.updateTable('users', {
  //  throughput: { read: 3},
  //  localIndexes: [
  //    {name: 'my_name', username: 'string'}
  //  ]
  //})
})
