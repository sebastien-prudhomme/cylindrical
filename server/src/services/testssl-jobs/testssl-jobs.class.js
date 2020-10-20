const errors = require('@feathersjs/errors')
const request = require('request-promise-native')

function buildResult (item) {
  return {
    id: item.metadata.name,
    parameters: item.spec.arguments.parameters,
    phase: item.status === undefined ? undefined : item.status.phase
  }
}

exports.TestsslJobs = class TestsslJobs {
  constructor (app) {
    this.kubeConfig = app.get('kubeConfig')
    this.kubeRequestOpts = app.get('kubeRequestOpts')
  }

  async find (params) {
    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/default/workflows`,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.get(requestOpts)

      return response.items.map(item => buildResult(item))
    } catch (error) {
      throw new errors.GeneralError(error)
    }
  }

  async get (id, params) {
    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/default/workflows/${id}`,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.get(requestOpts)

      return buildResult(response)
    } catch (error) {
      throw new errors.GeneralError(error)
    }
  }

  async create (data, params) {
    const workflow = {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Workflow',
      metadata: {
        generateName: 'testssl-'
      },
      spec: {
        entrypoint: 'testssl',
        arguments: {
          parameters: [
            {
              name: 'target',
              value: data.target
            }
          ]
        },
        workflowTemplateRef: {
          name: 'testssl'
        }
      }
    }

    const requestOpts = {
      uri: `${this.kubeConfig.getCurrentCluster().server}/apis/argoproj.io/v1alpha1/namespaces/default/workflows`,
      body: workflow,
      ...this.kubeRequestOpts
    }

    try {
      const response = await request.post(requestOpts)

      return buildResult(response)
    } catch (error) {
      throw new errors.GeneralError(error)
    }
  }
}
