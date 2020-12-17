// Модуль vuex. 
// Работа с Группами
import filtersData from './dst-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/datastoreType/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/datastoreTypes/${postfix}`
}

const moduleCode = 'dst'

const emptyObject = {
  name : 'New Datastore Type',
  code : ''
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject),
}

const getters = {
  ...mapShareGetters(moduleCode),
}

const actions = {
  ...mapShareActions(moduleCode),
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