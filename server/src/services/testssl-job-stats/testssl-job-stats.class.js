const errors = require('@feathersjs/errors')
const request = require('request-promise-native')
const { buildKubernetesError } = require('../../helpers/kubernetes')

exports.TestsslJobStats = class TestsslJobStats {
  constructor (app) {
    this.kubeConfig = app.get('kubeConfig')
    this.kubeRequestOpts = app.get('kubeRequestOpts')
    this.pendingMax = app.get('pendingMax')
  }

  async get (id, params) {
    switch (id) {
      case 'pending': {
        const requestOpts = {
          uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows`,
          ...this.kubeRequestOpts
        }

        try {
          const response = await request.get(requestOpts)

          return {
            id,
            value: response.items.reduce((accumulator, item) => {
              if (item.status === undefined) {
                return accumulator + 1
              } else if (item.status.phase === undefined) {
                return accumulator + 1
              } else if (item.status.phase === 'Pending') {
                return accumulator + 1
              } else {
                return accumulator
              }
            }, 0)
          }
        } catch (error) {
          throw buildKubernetesError(error)
        }
      }
      case 'pendingMax':
        return { id, value: this.pendingMax }
      default:
        throw new errors.NotFound()
    }
  }

  // Called by 'testssl-job-events' service to refresh clients
  async update (id, data, params) {
    return this.get(id)
  }
}
