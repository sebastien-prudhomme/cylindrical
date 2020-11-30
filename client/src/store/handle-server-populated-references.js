import { groupBy, map, isObject } from 'lodash'

/**
 * This function sorts an array of objects based on an array of properties of the objects.
 *
 *
 * @param {Array} propertyValArr Eg: [3,2,1]
 * @param {Array} objectsArr Eg: [{id: 1, value: 'a'}, {id: 2, value: 'b'}, {id: 3, value: 'c'}]
 * @param {String} [propertyKey='id']
 * @returns
 */
function sortObjectArrayByIdsArray (propertyValArr, objectsArr, propertyKey = 'id') {
  if (Array.isArray(propertyValArr) && Array.isArray(objectsArr)) {
    const groups = groupBy(objectsArr, propertyKey)
    const orderedMap = map(propertyValArr, function (i) {
      if (isObject(i)) {
        return undefined
      }
      if (!groups[i]) {
        return undefined
      }
      return groups[i].shift()
    })
    return orderedMap.filter(r => r)
  }
  // Note -
  // In case there is a mismatch and either value is not an array - we return the original objectsArr.
  // This might need to be changed to an empty array based on the desired behaviour
  // Safer option is to send the original value back as this shouldn't actually happen since the propertyValArr is used to find the objectsArr in the first place in our usecase.
  return objectsArr
}

/**
   * This function sets up the server populated data without breaking the reactivity.
   * 1. Adds the incoming populated data in appropriate Feathers-Vuex Service Store
   * 2. Sets up a getter on the populated property key to get reactive records.
   * 2.1. The getter also maintains the order of items based on the unpopulated key.
   *    Eg. tagIds: [1, 2, 3] is used to order the items found by the findGetter when accessing <record>.tags
   *
   * @param {*} data The data from setupInstance
   * @param {*} populatedKey The property key which contains the server populated data and needs to be transformed to return reactive records.
   * @param {*} populateDef Populate Definition Object (Refer to feathers-graph-populate for details)
   *
   */
function handleServerPopulatedReferences (data, populatedKey, populateDef) {
  const { model: FeathersVuexModel, keyHere, keyThere = 'id', asArray = false } = populateDef
  if (!FeathersVuexModel) {
    throw new Error('Missing Feathers Vuex Model for the populated relationship', data, populatedKey, populateDef)
  }
  if (!keyHere) {
    throw new Error('Missing unpopulated key for setting up data.')
  }

  // Get Data populated from the server.
  const populatedData = data[populatedKey]

  if (Array.isArray(populatedData)) {
    // Populate multiple records in service store
    populatedData.map(obj => new FeathersVuexModel(obj))

    // delete the populatedKey as it won't be reactive.
    delete data[populatedKey]
  } else {
    // Populate single record in service store
    // eslint-disable-next-line no-new
    new FeathersVuexModel(data[populatedKey])

    // delete the populatedKey as it won't be reactive.
    delete data[populatedKey]
  }

  // We do this irrespective of the populated data.
  // This handles the case where the data is not populated by this record.
  if (asArray) {
    // Setup a findInStore getter on the populatedKey
    Object.defineProperty(data, populatedKey, {
      get: function () {
        const resolved = FeathersVuexModel.findInStore({
          query: {
            [keyThere]: {
              $in: [].concat(this[keyHere])
            }
          }
        }).data || []

        return sortObjectArrayByIdsArray(this[keyHere], resolved, keyThere)
      }
    })
  } else {
    // Setup a getFromStore getter on the populatedKey
    if (keyThere === 'id' || keyThere === '_id') {
      // keyThere is idField
      Object.defineProperty(data, populatedKey, {
        get: function () {
          return FeathersVuexModel.getFromStore(this[keyHere])
        }
      })
    } else {
      // keyThere is some other field
      Object.defineProperty(data, populatedKey, {
        get: function () {
          const resolved = FeathersVuexModel.findInStore({
            query: {
              [keyThere]: {
                $in: [].concat(this[keyHere])
              }
            }
          }).data || []
          if (Array.isArray(resolved) && resolved.length) {
            return resolved[0]
          }
          return undefined
        }
      })
    }
  }
}

export { handleServerPopulatedReferences }
