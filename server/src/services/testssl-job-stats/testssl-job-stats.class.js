const errors = require('@feathersjs/errors')
const request = require('request-promise-native')
const { buildKubernetesError } = require('../../helpers/kubernetes')

exports.TestsslJobStats = class TestsslJobStats {
  constructor (app) {
    this.kubeConfig = app.get('kubeConfig')
    this.kubeRequestOpts = app.get('kubeRequestOpts')
  }

  async get (id, params) {
    switch (id) {
      case 'running':
        const requestOpts = {
          uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows`,
          ...this.kubeRequestOpts
        }

        try {
          const response = await request.get(requestOpts)

          return  {
            id: 'running',
            value: response.items.reduce((accumulator, item) => {
              if (item.status === undefined) {
                return accumulator
              } else if (item.status.phase === 'Running') {
                return accumulator + 1
              } else {
                return accumulator
              }
            }, 0)
          }
        } catch (error) {
          throw buildKubernetesError(error)
        }
      default:
        throw new errors.NotFound()
    }
  }

  // Called by 'testssl-job-events' service to refresh clients
  async update (id, data, params) {
    return this.get(id)
  }
}
