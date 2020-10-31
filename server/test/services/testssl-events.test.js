const assert = require('assert')
const app = require('../../src/app')

describe('\'testssl-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('testssl-events')

    assert.ok(service, 'Registered the service')
  })
})
