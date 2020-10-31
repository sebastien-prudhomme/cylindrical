const { buildKubernetesId, buildKubernetesData } = require('../../helpers/kubernetes')

exports.TestsslEvents = class TestsslEvents {
  constructor (app) {
    this.app = app
  }

  async create (data, params) {
    const event = JSON.parse(data.event)
    const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString())

    const id = buildKubernetesId(eventData.body)
    const updateData = buildKubernetesData(eventData.body)

    switch (eventData.type) {
      case 'ADD':
        break
      case 'UPDATE':
        await this.app.service('testssl-jobs').update(id, updateData)
        break
      case 'DELETE':
        await this.app.service('testssl-jobs').remove(id)
        break
      default:
        break
    }
  }
}
