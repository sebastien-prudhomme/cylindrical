const assert = require('assert')
const app = require('../../src/app')

describe('\'testssl-artifacts\' service', () => {
  it('registered the service', () => {
    const service = app.service('testssl-artifacts')

    assert.ok(service, 'Registered the service')
  })
})
