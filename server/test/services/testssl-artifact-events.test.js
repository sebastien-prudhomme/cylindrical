const assert = require('assert');
const app = require('../../src/app')

describe('\'testssl-artifact-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('testssl-artifact-events')

    assert.ok(service, 'Registered the service')
  })
})
