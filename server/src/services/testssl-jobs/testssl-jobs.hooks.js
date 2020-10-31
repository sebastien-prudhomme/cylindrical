const { disallow } = require('feathers-hooks-common')
const Joi = require('@hapi/joi')
const validateJoi = require('@feathers-plus/validate-joi')

const joiCreateSchema = Joi.object({
  parameters: Joi.object({
    target: Joi.string().domain()
  })
})

const joiUpdateSchema = Joi.object({
  parameters: Joi.object({
    target: Joi.string().domain()
  }),
  phase: Joi.string().valid('Error', 'Failed', 'Omitted', 'Pending', 'Running', 'Skipped', 'Succeeded')
})

const joiOptions = {
  abortEarly: false,
  allowUnknown: false,
  convert: true,
  presence: 'required'
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateJoi.form(joiCreateSchema, joiOptions)],
    update: [
      disallow('external'),
      validateJoi.form(joiUpdateSchema, joiOptions)
    ],
    patch: [],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
