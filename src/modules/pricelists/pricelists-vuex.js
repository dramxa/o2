// Модуль vuex. 
// Работа с прайс листами
import filtersData from './pricelists-vuex-filter'

import Vue from 'vue'
import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/pricelist/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/pricelists/${postfix}`
}

const moduleCode = 'prc'

const emptyObject = {
  groupId       : null,
  projectId     : null, 
  name          : 'New Pricelist',
  description   : '',
  currencyCode  : 'RUB',

  prep          : { prices: {} },

  services      : [
    { 'serviceCode' : 'cpu'   , 'history' : [] },
    { 'serviceCode' : 'ram'   , 'history' : [] },
    { 'serviceCode' : 'sas'   , 'history' : [] },
    { 'serviceCode' : 'sata'  , 'history' : [] },
    { 'serviceCode' : 'ssd'   , 'history' : [] },
    { 'serviceCode' : 'winlic', 'history' : [] },
    { 'serviceCode' : 'edge'  , 'history' : [] },
  ],
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject)
}

const getters = {
  ...mapShareGetters(moduleCode)
}

const actions = {
  ...mapShareActions(moduleCode, '_getItems'),

  prc_getItems : async ({ dispatch }) => {
    if(Vue.prototype.$security.havePermission('ft_prcRead'))
      dispatch('prc_getItems_INNER');    
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