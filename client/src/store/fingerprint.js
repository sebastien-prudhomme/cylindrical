export default {
  namespaced: true,
  state () {
    return {
      visitorId: ''
    }
  },
  mutations: {
    setVisitorId: function (state, payload) {
      state.visitorId = payload.visitorId
    }
  },
  actions: {
    setVisitorId: function (context, payload) {
      context.commit('setVisitorId', payload)
    }
  }
}
