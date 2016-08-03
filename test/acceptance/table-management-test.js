'use strict'

const assert            = require('assert')
const config            = require('../../index')
const connectionParams  = require('../support/connection-params')

let dynamoed            = config(connectionParams)

describe('Acceptance: create, delete and list tables', () => {
  beforeEach((done) => {
    dynamoed()
      .deleteTable('users')
      .then((r) =>  { done() })
      .catch((e) => { done() })
  })

  describe('createTable(name, options)', () => {
    it('works and returns a table representation', (done) => {
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

  describe('deleteTable(name) when the table exists', () => {
    beforeEach((done) => {
      dynamoed()
        .createTable('users', {
          key: [{id: 'string'}, {username: 'string'}]
        })
        .then(() => { done() })
        .catch(done)
    })

    it('does not throw an error', (done) => {
      dynamoed()
        .deleteTable('users')
        .then((table) => { done() })
        .catch((e) => done(e))
    })
  })

  describe('deleteTable(name) when table does not exist', () => {
    it('throws an error if the table exists', (done) => {
      dynamoed()
        .deleteTable('users')
        .then(() => { done(new Error('no error thrown')) })
        .catch((e) => { done() })
    })
  })

  describe('listTables()', () => {
    beforeEach((done) => {
      dynamoed()
        .createTable('users', {
          key: [{id: 'string'}, {username: 'string'}]
        })
        .then(() => { done() })
        .catch(done)
    })

    it('returns an array of names', (done) => {
      dynamoed()
        .listTables()
        .then((tables) => {
          assert.deepEqual(tables, ['users'])
          done()
        })
    })
  })

  describe('describeTable(name)', () => {
    beforeEach((done) => {
      dynamoed()
        .createTable('users', {
          key: [{id: 'string'}, {username: 'string'}]
        })
        .then(() => { done() })
        .catch(done)
    })

    it('returns a parsed table', (done) => {
      dynamoed()
        .describeTable('users')
        .then((table) => {
          assert.equal(table.name, 'users')
          assert.deepEqual(table.key, [
            {id: 'string', type: 'hash'},
            {username: 'string', type: 'range'}
          ])
          assert.deepEqual(table.throughput, {
            read: 1,
            write: 1
          })
          done()
        })
        .catch(done)
    })
  })
})
