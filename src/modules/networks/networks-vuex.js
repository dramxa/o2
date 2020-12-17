// Модуль vuex. 
// Работа с Сетями
import filtersData from './networks-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/network/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/networks/${postfix}`,

  apiUrlAdmItem : (postfix) => `adm/v1.0/networks/${postfix}`
}

const moduleCode = 'net'

const emptyObject = {
  name    : 'New Network',
  comment : '',
  type    : 'isolated',
  prep    : { }    
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject)
}

const getters = {
  ...mapShareGetters(moduleCode)
}

const actions = {
  ...mapShareActions(moduleCode, [
    '_create'
  ]),

  /**  выбор объекта для редактирования по ID */
  net_create: async ({dispatch, getters}, extPropInner) => {
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
    await dispatch("net_create_INNER", extraProps);
  }, 
  
  /** действие по изменению состояния нескольких или одной ВМ, с подтверждением*/
  net_resyncConfirm: async ({getters}, id)=>{
    Vue.prototype.$windows.showDialog({
        dialogCode: 'confirmDialog',
        props: {
          type         : 'resync',
          textConst    : 'net_resync',
          objArray     : [ getters.net_itemsAll.find(f=>f.id == id).name ]                    
        },

        onAccept: function(){
              Vue.prototype.$api.putItem(apiUrls.apiUrlAdmItem(`${id}/sync`), null, true)      
        } // -- onAccept
    }) // -- Vue.prototype.$windows.showDialog    
  },  
  
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