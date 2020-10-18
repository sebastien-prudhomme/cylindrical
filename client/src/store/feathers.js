import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import feathersVuex from 'feathers-vuex'
import { Cookies } from 'quasar'

const FEATHERS_SOCKETIO_TIMEOUT = 30000

let application
let applicationVuex

function getApplication () {
  return application
}

function getApplicationVuex () {
  return applicationVuex
}

function initFeathers ({ ssrContext }) {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies

  const FEATHERS_TRANSPORT = process.env.FEATHERS_TRANSPORT || cookies.get('FEATHERS_TRANSPORT') || 'socketio'
  const FEATHERS_URL = process.env.FEATHERS_URL || cookies.get('FEATHERS_URL') || 'http://localhost:3030'

  application = feathers()

  if (FEATHERS_TRANSPORT === 'rest') {
    const restClient = rest(FEATHERS_URL)

    application.configure(restClient.fetch(window.fetch))
  }

  if (FEATHERS_TRANSPORT === 'socketio') {
    const socket = io(FEATHERS_URL)

    application.configure(socketio(socket, { timeout: FEATHERS_SOCKETIO_TIMEOUT }))
  }

  applicationVuex = feathersVuex(application)
}

export { getApplication, getApplicationVuex, initFeathers }
