// Модуль vuex. 
// Работа с Организациями
import Vue from 'vue';
import extBus from '@/modules/_system/_extension/_bus'
import filtersData from './orgs-vuex-filter'
import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/org/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/orgs/${postfix}`
}

const moduleCode = 'org'

const emptyObject = {
  name        : 'New Organization',
  code        : '',
  fullName    : '',
  comment     : '',
  isBlocked   : false
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject)
}

const getters = {
  ...mapShareGetters(moduleCode)
}

const actions = {
  ...mapShareActions(moduleCode),
  
  org_setLockState: async  ({getters, commit}, {item, lockState}) => {
    Vue.prototype.$windows.showDialog({
        dialogCode: 'confirmDialog',
        props: {
          textConst    : lockState ? 'confirmLock' : 'confirmUnLock',
          objArray     : [ item.name ]
        },
        onAccept: function(){
          var newItem = clone(item);
          newItem.isBlocked = lockState;
          Vue.prototype.$api.putItem(apiUrls.apiUrlItem(newItem.id), newItem)
            .then(org=>{
              commit('ORG_PUT_ITEM', org);
              extBus.$emit(`update-self-restriction-${moduleCode}`);
              extBus.$emit(`update-other-restriction-${moduleCode}`);        
              showMessage('changeLockState', { 
                message     : 'Lock state successfully changed to - ' +  (org.isBlocked ? 'LOCKED' : 'UNLOCKED'), 
                subjectName : org.name });
            })
        }
    })
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