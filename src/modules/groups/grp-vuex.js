// Модуль vuex. 
// Работа с Группами
import filtersData from './grp-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/group/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/groups/${postfix}`
}

const moduleCode = 'grp'

const emptyObject = {
  name        : 'New Group',
  description : '',
  comment     : '',
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