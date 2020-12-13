const errors = require('@feathersjs/errors')
const request = require('request-promise-native')
const { buildKubernetesData, buildKubernetesError } = require('../../helpers/kubernetes')

exports.TestsslJobs = class TestsslJobs {
  constructor (app) {
    this.app = app
    this.kubeConfig = app.get('kubeConfig')
    this.kubeRequestOpts = app.get('kubeRequestOpts')
  }

  async find (params) {
    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows`,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.get(requestOpts)

      return response.items.map(item => buildKubernetesData(item))
    } catch (error) {
      throw buildKubernetesError(error)
    }
  }

  async get (id, params) {
    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows/${id}`,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.get(requestOpts)

      return buildKubernetesData(response)
    } catch (error) {
      throw buildKubernetesError(error)
    }
  }

  async create (data, params) {
    const pending = await this.app.service('testssl-job-stats').get('pending')
    const pendingMax = await this.app.service('testssl-job-stats').get('pendingMax')

    if (pending.value >= pendingMax.value) {
      throw new errors.Unavailable()
    }

    const workflow = {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Workflow',
      metadata: {
        generateName: 'testssl-'
      },
      spec: {
        entrypoint: 'testssl',
        arguments: {
          parameters: data.parameters
        },
        workflowTemplateRef: {
          name: 'testssl'
        }
      }
    }

    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/cylindrical/workflows`,
      body: workflow,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.post(requestOpts)

      return buildKubernetesData(response)
    } catch (error) {
      throw buildKubernetesError(error)
    }
  }

  // Called by 'testssl-job-events' service to refresh clients
  async update (id, data, params) {
    return this.get(id)
  }

  // Called by 'testssl-job-events' service to refresh clients
  async remove (id, params) {
    return { id }
  }
}
