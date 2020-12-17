// Модуль vuex. 
// Работа с Виртуальными Машинами
import Vue from 'vue'
import filtersData from './vms-vuex-filter';
import { vmPowerActions } from '@/consts/vmConsts'
import extBus from '@/modules/_system/_extension/_bus'

import snapshotActions from './vms-snap-vuex'

import { mapShareState,   mapShareGetters,
         mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/vm/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/vms/${postfix}`,

  apiUrlAdmItem : (postfix) => `adm/v1.0/vm/${postfix}`
}

const moduleCode = 'vm'

const emptyObject = {
  name                   : 'New VM name',
  comment                : '',
  cpu                    : 1,
  ram                    : 2048,
  powerStateCode         : "stopped",
  disks                  : [],
  networks               : [],
  mediaImageContainers   : [],
  tags                   : [],
  spec                   : {},

  groupId       : null,
  projectId     : null
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject),
  _extEditor  : false,           // признак работы в расширенном редакторе
  
  _monitoringId : null,         // мониторинг
}


const getters = {
  ...mapShareGetters(moduleCode),
  vm_extEditor        : state    => state._extEditor,

  vm_monitoringId     : state    => state._monitoringId,
  vm_monitoringVm     : state    => state._items.find(item => item.id == state._monitoringId),
}

const actions = {
  ...snapshotActions,
  ...mapShareActions(moduleCode,    // мапим стандартные ф-ии и кастомизируем некоторые из них
  [
    '_create',
    '_setShowProperty', 
    '_applyChangesConfirm'
  ]), 

  // установка параметра  _vm_show_property_id
  vm_setShowProperty: async ({dispatch, getters}, id) => {
    try{
      if(getters['med_itemsAll'].length==0)
        await dispatch("med_getItems");
    }catch{}

    try{
      if(getters['net_itemsAll'].length==0)
        await dispatch("net_getItems");
    }catch{}

    await dispatch("vm_setShowProperty_INNER", id);
  },

  /**  выбор объекта для редактирования по ID */
  vm_create: async ({dispatch, getters}, extPropInner) => {
    let currentLocation = clone(getters.lctn_defaultResourceProfile)
    let extraProps = {
      resourceProfileId : currentLocation.resourceProfile.id,
      prep               : {
              resourceProfileFullpath  : currentLocation.fullPath
      }
    };
    extraProps = { ...extraProps, ...extPropInner };
    await dispatch("vm_create_INNER", extraProps);
  },  

  
  /**  отправка изменений на сервер */
  vm_createConfirmMultiple: async ({state, getters, commit, dispatch}, { count, startWith, mask }) => {
    var tmplId = getters.vm_edited.prep.templateId;
    var createFromTemplate = getters.vm_editNewObject && !isNullOrUndefined(tmplId)

    let name = getters[`${state.mc}_edited`].name;
    var nameArrays = []

    // TODO: обработка маски и прочего 
    for(var i = startWith; i < startWith + count; i++){
      if(mask.masked){
        nameArrays.push(mask.firstPartName + i.toString().padStart(mask.mask.length, '0') + mask.secondPartName);
      }else
        nameArrays.push(name + i.toString())
    }
    // ----------------------------------

    Vue.prototype.$windows.showDialog({
        dialogCode: 'confirmDialog',

        props: {
          textConst    : 'confirmCreateMultiple',
          rangeLength  : count,
          rangeFirst   : nameArrays[0],
          rangeLast    : nameArrays[nameArrays.length - 1] 
        },

        onAccept: async() => {
          var obj = clone(getters[`${state.mc}_edited`]);
          commit(`${state.MC}_SET_EDITED`, null);                // очищаем объект редактирования
          dispatch('vm_setExtEditorState', false);               // закрываем окно полного редактора
          dispatch('vm_setShowProperty')

          if(!isNullOrUndefined(obj.prep))   // очищаем объект от предподготовленных данных
            delete obj.prep

          for(var i = 0; i < nameArrays.length; i++){
            obj.name = nameArrays[i]; // применяем к новому объекту имя будущего экземпляра
            var item = !createFromTemplate ? await Vue.prototype.$api.postItem(state.apiUrlItem(), obj)  // запрос на создание нового объекта
                : await Vue.prototype.$api.postItem(apiUrls.apiUrlItem(`sourceTemplate/${tmplId}`), obj) // запрос на создание нового объекта из шаблона
              commit(`${state.MC}_PUT_ITEM`, item);              // изменяем объект в списке
          }
 
          extBus.$emit(`update-self-restriction-${state.mc}`);   // обновляем собственные зависимости
          extBus.$emit(`update-other-restriction-${state.mc}`);  // информируем остальных что список обновлен
        }
      })    
  },


  /**  отправка изменений на сервер */
  vm_applyChangesConfirm: async ({dispatch, commit, getters}) => {
    var tmplId = getters.vm_edited.prep.templateId;
    if(getters.vm_editNewObject && !isNullOrUndefined(tmplId)){ // если идет создание объекта из шаблона
      await dispatch("vm_createFromTmpl");
      return; 
    }      
    dispatch("vm_applyChangesConfirm_INNER").then(
      res=>{
        if(!res.confirmCanceled && isNullOrUndefined(res.error))        
          commit('VM_SET_EXTEDITOR_STATE', false);
      }
    )
  }, 

  
  vm_createFromTmpl: async ({commit, getters, dispatch}) => {
    var obj = getters.vm_edited;
    var tmplId = obj.prep.templateId;
    let name = obj.name;

    Vue.prototype.$windows.showDialog({

      dialogCode   : 'confirmDialog',

      props: {
        textConst  : 'confirmCreate',
        objArray   :  [ name ]
      },

      onAccept: function(){
        commit("VM_SET_EDITED_APPLYING", true );
        Vue.prototype.$api.postItem(apiUrls.apiUrlItem(`sourceTemplate/${tmplId}`), obj) // запрос на создание
          .then( item=>{
            commit("VM_SET_EDITED_APPLYING", false);
            commit('VM_PUT_ITEM', item );  // изменяем объект в списке  
            extBus.$emit(`update-self-restriction-${moduleCode}`);
            extBus.$emit(`update-other-restriction-${moduleCode}`);
          
            commit("VM_SET_EDITED", null);  // очищаем объект редактирования
            commit('VM_SET_EXTEDITOR_STATE', false);
            dispatch('vm_setShowProperty')
          })
          .catch(res=>{
            commit("VM_SET_EDITED_APPLYING", false);
          })
      } // -- onAccept
    }) // -- Vue.prototype.$windows.showDialog   
  },

  /** смена состояния окна полного редактора ВМ */
  vm_setExtEditorState: async ({commit, dispatch}, value) => {
    await dispatch('glb_setShowProperties', !value);
    commit('VM_SET_EXTEDITOR_STATE', value);
  },

  /** смена состояния окна мониторинга */
  vm_setMonitoringState: async ({commit, dispatch}, value = null) => {
    commit('VM_SET_MONITORING_ID', value);
  },

  /** действие по изменению состояния нескольких или одной ВМ, с подтверждением*/
  vm_actionsConfirm: async ({dispatch, commit, getters}, { action, vmId })=>{
    var singleItem = !isNullOrUndefined(vmId);

    Vue.prototype.$windows.showDialog({

        dialogCode: 'confirmDialog',

        props: {
          type         : action,
          textConst    : singleItem ? `vm_${action}` : `vms_${action}`,
          objArray     : singleItem ?  [ getters.vm_itemsAll.find(f=>f.id == vmId).name ] :
                      getters.vm_itemsAll.filter(f=>getters.vm_itemsSelected.some(s=>s== f.id)).map(m=>m.name)
        },

        onAccept: function(type){
          if(singleItem){      
              var sendObject = { powerStateCmdCode:  vmPowerActions[action] };
              Vue.prototype.$api.putItem(apiUrls.apiUrlItem(`${vmId}/powerState`), sendObject)
               .then(srvItem =>{
                if(!isNullOrUndefined(srvItem)){
                  commit('VM_PUT_ITEM', srvItem);
                  extBus.$emit(`update-self-restriction-${moduleCode}`);
                  extBus.$emit(`update-other-restriction-${moduleCode}`);              
                }
              });
            }
          else {
            getters.vm_itemsSelected.forEach(itemId=>{
              var item = getters.vm_itemsAll.find(f=>f.id == itemId)      
              var sendObject = { powerStateCmdCode:  vmPowerActions[action] };      
              Vue.prototype.$api.putItem(apiUrls.apiUrlItem(`${item.id}/powerState`), sendObject)
                .then(srvItem =>{
                  if(!isNullOrUndefined(srvItem)){
                    commit('VM_PUT_ITEM', srvItem);
                    extBus.$emit(`update-self-restriction-${moduleCode}`);
                    extBus.$emit(`update-other-restriction-${moduleCode}`);              
                  }
                })
            
            });
            dispatch('vm_setSelectedItems');             
          }        
        } // -- onAccept
    }) // -- Vue.prototype.$windows.showDialog    
  },




  /** действие по изменению состояния нескольких или одной ВМ, с подтверждением*/
  vm_resyncConfirm: async ({getters}, id)=>{
    Vue.prototype.$windows.showDialog({
        dialogCode: 'confirmDialog',
        props: {
          type         : 'resync',
          textConst    : 'vm_resync',
          objArray     : [ getters.vm_itemsAll.find(f=>f.id == id).name ]                    
        },

        onAccept: function(type){
              Vue.prototype.$api.putItem(apiUrls.apiUrlAdmItem(`${id}/sync`), null, true)      
        } // -- onAccept
    }) // -- Vue.prototype.$windows.showDialog    
  }, 

  /** Сброс флага hasError у одной или нескольких ВМ.*/
  vm_resetErrorsConfirm: async ({getters, dispatch}, ids)=>{
    if(!Array.isArray(ids))
      ids = [ids];

    Vue.prototype.$windows.showDialog({
        dialogCode: 'confirmDialog',
        props: {
          textConst    : 'vm_resetError',
          objArray     : getters.vm_itemsAll.filter(f=>ids.includes(f.id)).map(m=>m.name)                  
        },

        onAccept: function(){
          ids.forEach(id=>{
            Vue.prototype.$api.putItem(apiUrls.apiUrlItem(`${id}/resetError`)) ;

          })
          if(ids.length > 1)
            dispatch('vm_setSelectedItems');       
        } // -- onAccept
    }) // -- Vue.prototype.$windows.showDialog    
  },  

  vm_admImport({getters}){
    Vue.prototype.$windows.showDialog({
      dialogCode: 'admImportVmDialog',

      onAccept: function(data){
            Vue.prototype.$api.postItem(apiUrls.apiUrlAdmItem('import'), data, true)      
      } // -- onAccept
    }) // -- Vue.prototype.$windows.showDialog    
  }, 

  vm_clone: async ({commit, getters}, { id, propAdd }) => {
    var item = getters.vm_itemsAll.find(f=>f.id == id);
    if(isNullOrUndefined(item))
      return;

    var clearedItem = clone(item); // клонируем объект
    delete clearedItem.id;         // удаляем параметр id
    if(propAdd.multiple)
      clearedItem.name += propAdd.text
    else
      clearedItem.name = propAdd.text;

    clearedItem = Object.assign({}, clearedItem, {...propAdd});
    Vue.prototype.$api.postItem(apiUrls.apiUrlItem(`sourceVm/${id}`), clearedItem)
    .then(res=>{
      commit('VM_PUT_ITEM', res);
      extBus.$emit(`update-self-restriction-${moduleCode}`);
      extBus.$emit(`update-other-restriction-${moduleCode}`);
    }) 
  },

  vm_migrate: async ({commit, getters}, { id, propAdd }) => {
    var item = getters.vm_itemsAll.find(f=>f.id == id);
    if(isNullOrUndefined(item))
      return;

    var clearedItem = clone(item); // клонируем объект
    clearedItem = Object.assign({}, clearedItem, {...propAdd});
    Vue.prototype.$api.putItem(apiUrls.apiUrlItem(id), clearedItem)      
      .then(res=>{
        commit('VM_PUT_ITEM', res);
        extBus.$emit(`update-self-restriction-${moduleCode}`);
        extBus.$emit(`update-other-restriction-${moduleCode}`);
      })
  },

  vm_changeProjectAndGroup: async ({getters, commit, dispatch}, { data, projectId, groupId }) => {
    if(!Array.isArray(data))
      data = [ data ];
   
    var vms = clone(getters.vm_itemsAll.filter(f=>data.includes(f.id)));
    vms.forEach(item=>{
      item.projectId = projectId;
      item.groupId = groupId;
      Vue.prototype.$api.putItem(apiUrls.apiUrlItem(item.id), item)      
        .then(res=>{
          commit('VM_PUT_ITEM', res);
          if(data.length > 1)
            dispatch('vm_setSelectedItems'); 
          extBus.$emit(`update-self-restriction-${moduleCode}`);
          extBus.$emit(`update-other-restriction-${moduleCode}`);
        })
    })
  }
}

const mutations = {
  ...mapShareMutations(moduleCode),

  VM_SET_EXTEDITOR_STATE (state, value) {
    state._extEditor = value;
  },

  VM_SET_MONITORING_ID (state, value) {
    state._monitoringId = value;
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}