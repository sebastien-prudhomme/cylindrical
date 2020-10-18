const k8s = require('@kubernetes/client-node')

module.exports = function (app) {
  const kubeConfig = new k8s.KubeConfig()
  kubeConfig.loadFromDefault()

  const kubeRequestOpts = { json: true }
  kubeConfig.applyToRequest(kubeRequestOpts)

  app.set('kubeConfig', kubeConfig)
  app.set('kubeRequestOpts', kubeRequestOpts)
}
