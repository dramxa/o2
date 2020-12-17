// Модуль vuex. 
// Работа с Проектами
import filtersData from './projects-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/project/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/projects/${postfix}`
}

const moduleCode = 'prj'

const emptyObject = {
  name        : 'New Project',
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