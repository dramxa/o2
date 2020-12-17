// Модуль vuex. 
// Работа с Лимитами
import filtersData from './limits-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/limit/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/limits/${postfix}`
}

const moduleCode = 'lmt'

const emptyObject = {
  name          : 'New Limit',

  keyAttributes : [],
  limitItems    : []
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject)
}

const getters = {
  ...mapShareGetters(moduleCode)
}

const actions = {
  ...mapShareActions(moduleCode)
}

const mutations = {
  ...mapShareMutations(moduleCode)
}

export default {
  state,
  getters,
  actions,
  mutations
}