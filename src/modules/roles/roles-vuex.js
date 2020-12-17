// Модуль vuex. 
// Работа с Ролями
import filtersData from './roles-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/role/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/roles/${postfix}`
}

const moduleCode = 'role'

const emptyObject = {
  groupId       : null,
  projectId     : null, 
  name          : 'New Role',

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