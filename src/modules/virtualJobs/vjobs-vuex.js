// Модуль vuex. 
// Работа с Тасками
import filtersData from './vjobs-vuex-filter'
import Vue from 'vue'
import extBus from '@/modules/_system/_extension/_bus'

import { jobTypes } from '@/consts/taskConsts';

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const ITEMS_PER_PAGE = Math.round((globalThis.innerHeight - 112 - 48) / 48)

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/virtualjob/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/virtualjobs/${postfix}`
}

const moduleCode = 'vjob'

const emptyObject = {
  name    : '',
  comment : ''
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject),

  _start_date  : null, 
  _page        : 0,  
  _total_pages : 0  
}

const getters = {
  ...mapShareGetters(moduleCode),

  vjob_startDate: state => state._start_date,
   
  vjob_page           : state => state._page,
  vjob_totalPages     : state => state._total_pages,
  vjob_userChangePage : state => state._page > 0
}

const actions = {
  ...mapShareActions(moduleCode, ['_getItems']),

  /** ф-я получения данных с сервера  */
  vjob_getItems: function ({state, getters, commit, dispatch}, data = null) {
    return new Promise( resolve => {
        if(getters[`${state.mc}_loading`] || getters.guide_show) return resolve();     // проверяем загружаются ли данные с сервера сейчас

        if(data==null){
          data = { };
        }

        if(!isNullOrUndefined(data.dateStartTo)){
          commit('VJOB_SET_START_DATE', data.dateStartTo);
        }

        data = Object.assign({}, data, { maxRows: ITEMS_PER_PAGE })

        dispatch("glb_incLoading");                    // увеличиваем счетчик общих загрузок с сервера
        commit(`${state.MC}_SET_LOADING_STATE`, true); // выставляем флаг загрузки с сервера для модуля
   
        Vue.prototype.$api.getItems(state.apiUrlItems(), false, data) // грузим данные
          .then(res=>{  // успех
              var items = res.result;

              var startDate = getters[`${state.mc}_startDate`];
              if(isNullOrUndefined(data.dateStartTo)){
                let maxDate = new Date(Math.max(...items.map(e => new Date(e.dateStart))));                
                maxDate.setSeconds(maxDate.getSeconds() + 1);
                startDate = maxDate.toISOString();
              }

              commit('VJOB_SET_INFO', { 
                startDate,
                page       : res.searchInfo.pageNum, 
                totalPages : res.searchInfo.totalPages,  
              });

              if(!isNullOrUndefined(items)) {   // если данные есть
                items.forEach(item=>{
                  Vue.set(item, 'prep', {});
                  }) // добавляем в объект параметр, где будут все скалькулированные данные
                commit(`${state.MC}_PUSH_ITEMS`       , items);         // пушим в стейт 
                commit(`${state.MC}_SET_FIRST_LOAD`)                    // выставляем флаг что первая загрузка данных с сервера прошла
                commit(`${state.MC}_SET_LOADING_STATE`, false);         // убираем флаг загрузки данных с сервера для модуля
                extBus.$emit(`update-self-restriction-${state.mc}`);    // шлем в шину сообщение что нужно дополнить данные зависимостей из других модулей
                dispatch("glb_decLoading");                             // уменьшаем счетчик общих загрузок с сервера
                commit(`${state.MC}_SET_GET_UNREACHABLE`, false);
                dispatch(`${state.mc}_setShowProperty`);
              }
              return resolve();
          })
          .catch(res=>{ // провал
              commit(`${state.MC}_SET_LOADING_STATE`, false);           // убираем флаг загрузки данных с сервера для модуля
              dispatch("glb_decLoading");                               // уменьшаем счетчик общих загрузок с сервера
              commit(`${state.MC}_SET_GET_UNREACHABLE`, true);  
              return resolve(); 
          })
      }
    )
  },

  vjob_goToPage: function({state, getters, commit, dispatch}, page){
    var startDate  = getters[`${state.mc}_startDate`];
    var totalPages = getters[`${state.mc}_totalPages`];

    if(page == null)
      dispatch('vjob_getItems');

    if(page < 1)
      page = 1;

    if(page > totalPages)
      page = totalPages;
    
    dispatch('vjob_getItems', { pageNum: page, dateStartTo: startDate })
  },

  vjob_goToFirstPage: function({state, getters, commit, dispatch}){
    dispatch('vjob_goToPage', 1);
  },

  vjob_goToLastPage: function({state, getters, commit, dispatch}){
    var totalPages = getters[`${state.mc}_totalPages`];    
    dispatch('vjob_goToPage', totalPages);
  },


  vjob_goToNextPage: function({state, getters, commit, dispatch}){
    var thisPage   = getters[`${state.mc}_page`];
    dispatch('vjob_goToPage', thisPage + 1);
  },

  vjob_goToPreviousPage: function({state, getters, commit, dispatch}){
    var thisPage   = getters[`${state.mc}_page`];
    dispatch('vjob_goToPage', thisPage - 1);
  },

  vjob_setPage: async ({commit}, value) => {
      commit("VJOB_SET_PAGE", value);
  },


  vjob_acknowledge: async  ({getters, commit}, item) => {
    var jobCaption = jobTypes[item.virtualJobTypeCode]
    jobCaption = isNullOrUndefined(jobCaption) ? item.virtualJobTypeCode : jobCaption;
    Vue.prototype.$windows.showDialog(
      {
        dialogCode: 'confirmDialog',

        props: {
          textConst    : 'taskAcknowledge',
          objArray     :  [ jobCaption ]
        },

        onAccept: function(){
          Vue.prototype.$api.putItem(apiUrls.apiUrlItem(`${item.id}/acknowledge`))
            .then(newItem=>{
              commit('VJOB_PUT_ITEM', newItem);
              extBus.$emit(`update-self-restriction-${moduleCode}`);

              showMessage('taskAcknowledge', 
                { 
                  message:'Acknowledge state changed'
                });
            })
        }
      })
  },
}

const mutations = {
  ...mapShareMutations(moduleCode),

  VJOB_SET_START_DATE: function(state, value){
    state._start_date  = value;
  },

  VJOB_SET_PAGE: function(state, value){
    state._page  = value;
  },

  VJOB_SET_INFO: function(state, { totalPages,  page, startDate}){
    state._page        = page;
    state._total_pages = totalPages;
    state._start_date  = startDate;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}