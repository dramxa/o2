// Модуль vuex. 
// Работа с Шаблонами
import filtersData from './templates-vuex-filter'
import Vue from 'vue'
import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/template/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/templates/${postfix}`
}

const moduleCode = 'tmpl'

const emptyObject = {
  id          : null,
  name        : '',
  description : '',
  comment     : '',
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject),

  _tepmplateType : 'public'
}

const getters = {
  ...mapShareGetters(moduleCode),

  tmpl_tepmplateType : state    => state._tepmplateType,
}

const actions = {
  ...mapShareActions(moduleCode),  

  tmpl_setTemplateType : async ({commit}, value) => {
    commit("TMPL_SET_TEMPLATE_TYPE", value);
  },
  
  tmpl_cloneToTemplate: async ({commit, getters}, data) => {
    Vue.prototype.$api.postItem(apiUrls.apiUrlItem('cloneFromVm'), data)      
      .then(res=>{
      })
  },
  
  tmpl_convertToTemplate: async ({commit, getters}, data) => {
    Vue.prototype.$api.postItem(apiUrls.apiUrlItem('convertFromVm'), data)      
      .then(res=>{
      })
  },
}

const mutations = {
  ...mapShareMutations(moduleCode),

  TMPL_SET_TEMPLATE_TYPE(state, value){
    state._tepmplateType = value;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}