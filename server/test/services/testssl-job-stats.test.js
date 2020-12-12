const assert = require('assert')
const app = require('../../src/app')

describe('\'testssl-job-stats\' service', () => {
  it('registered the service', () => {
    const service = app.service('testssl-job-stats')

    assert.ok(service, 'Registered the service')
  })
})
