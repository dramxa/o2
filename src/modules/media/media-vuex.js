// Модуль vuex. 
// Работа с ISO
import filtersData from './media-vuex-filter'
import Vue from 'vue'
import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/media/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/medias/${postfix}`,

  apiUrlAdmItem : (postfix) => `adm/v1.0/media/${postfix}`
}

const moduleCode = 'med'

const emptyObject = {
  name    : '',
  comment : ''
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject)
}

const getters = {
  ...mapShareGetters(moduleCode)
}

const actions = {
  ...mapShareActions(moduleCode),

  med_admImport({getters}){
    Vue.prototype.$windows.showDialog({
      dialogCode: 'admImportIsoDialog',

      onAccept: function(data){
            Vue.prototype.$api.postItem(apiUrls.apiUrlAdmItem('import'), data, true)      
      } // -- onAccept
    }) // -- Vue.prototype.$windows.showDialog    
  }  
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