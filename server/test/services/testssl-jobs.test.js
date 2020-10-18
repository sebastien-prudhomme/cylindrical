const assert = require('assert')
const app = require('../../src/app')

describe('\'testssl-jobs\' service', () => {
  it('registered the service', () => {
    const service = app.service('testssl-jobs')

    assert.ok(service, 'Registered the service')
  })
})
