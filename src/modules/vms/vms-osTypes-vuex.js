// Модуль vuex. 
// Список операционных систем поддерживаемых системой виртуализации
import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/location/osTypes/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/location/osTypes/${postfix}`
}

const moduleCode = 'os'


const state = {
  ...mapShareState(moduleCode, { filter: {}, applyFilter: (item, filter)=>true }, apiUrls, {})
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