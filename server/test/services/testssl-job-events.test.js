const assert = require('assert')
const app = require('../../src/app')

describe('\'testssl-job-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('testssl-job-events')

    assert.ok(service, 'Registered the service')
  })
})
