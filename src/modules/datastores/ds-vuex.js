// Модуль vuex. 
// Работа с Группами
import filtersData from './ds-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/datastore/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/datastores/${postfix}`
}

const moduleCode = 'ds'

const emptyObject = {
  name          : 'New Datastore',
  isEnabled     : false,
  appliedTypeId : {
    isVirtualMachine : false,
    isTemplate       : false,
    isMediaImage     : false,
  }
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject),
}

const getters = {
  ...mapShareGetters(moduleCode),
}

const actions = {
  ...mapShareActions(moduleCode, [
    '_create'
  ]),

  /**  выбор объекта для редактирования по ID */
  ds_create: async ({dispatch, getters}, extPropInner) => {
    let currentLocation = clone(getters.lctn_defaultResourceProfile)
    let extraProps = {
      resourceProfileId :currentLocation.resourceProfile.id,
      prep               : {
        resourceProfileFullpath  : currentLocation.fullPath,
        serviceProvider          : currentLocation.serviceProvider,
        datacenter               : currentLocation.datacenter,
        resourceProfile          : currentLocation.resourceProfile
      }
    };
    extraProps = { ...extraProps, ...extPropInner };
    await dispatch("ds_create_INNER", extraProps);
  }, 
}

const mutations = {
  ...mapShareMutations(moduleCode),
}

export default {
  state,
  getters,
  actions,
  mutations
}