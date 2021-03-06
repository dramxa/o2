import Vue from 'vue'

const apiUrls = {
  apiUrlItems  : (postfix = '')=>`v1.0/analytics/vm_snaphot_stat/${postfix}`,
}

// moduleCode
const mc = 'dsbrd_vms'
const MC = mc.toUpperCase()

const state = {
    _loading : false,
    _item    : []
}

const getters = {
    [`${mc}_loading`]: state => state._loading,
    [`${mc}_item`   ]: state => state._item    
}

const actions = {
    /** ф-я получения данных с сервера  */
    [`${mc}_getItems`]: function ({state, getters, commit, dispatch}, {from, to} = { from: null, to: null}) {
        return new Promise( resolve => {
            if(getters[`${mc}_loading`]) return resolve();     // проверяем загружаются ли данные с сервера сейчас
            dispatch("glb_incLoading");                        // увеличиваем счетчик общих загрузок с сервера
            commit(`${MC}_SET_LOADING_STATE`, true);                // выставляем флаг загрузки с сервера для модуля

            if(from==null || to == null){
                from = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 32)).toISOString().split('T')[0];
                to = (new Date(Date.now())).toISOString().split('T')[0]
            }

            Vue.prototype.$api.getItem(apiUrls.apiUrlItems(`?date_from=${from}&date_to=${to}`)) // грузим данные
            .then(item=>{  // успех
                if(!isNullOrUndefined(item)) { // если данные есть
                    commit(`${MC}_PUSH_ITEM`       , item);  // пушим в стейт 
                    commit(`${MC}_SET_LOADING_STATE`, false);  // убираем флаг загрузки данных с сервера для модуля
                    dispatch("glb_decLoading");           // уменьшаем счетчик общих загрузок с сервера
                }
                return resolve();
            })
            .catch(res=>{ // провал 
                commit(`${MC}_SET_LOADING_STATE`, false);      // убираем флаг загрузки данных с сервера для модуля
                dispatch("glb_decLoading");               // уменьшаем счетчик общих загрузок с сервера
                return resolve(); 
            })
        }
    )
  },
  
}

const mutations = {
    [`${MC}_PUSH_ITEM`] : function(state, value){
        state._item = value;
    },

    [`${MC}_SET_LOADING_STATE`] : function(state, value){
        state._loading = value;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}