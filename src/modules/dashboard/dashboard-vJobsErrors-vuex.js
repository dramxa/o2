import Vue from 'vue'

const apiUrls = {
  apiUrlItems  : (postfix = '')=>`v1.0/virtualjobs/${postfix}`,
}

// moduleCode
const mc = 'dsbrd_vjobs_errors'
const MC = mc.toUpperCase()

const state = {
    _loading : false,
    _items   : []
}

const getters = {
    [`${mc}_loading`]: state => state._loading,
    [`${mc}_items`  ]: state => state._items    
}

const actions = {
    /** ф-я получения данных с сервера  */
    [`${mc}_getItems`]: function ({state, getters, commit, dispatch}, {from, to} = { from: null, to: null}) {
        return new Promise( resolve => {
            if(getters[`${mc}_loading`]) return resolve();     // проверяем загружаются ли данные с сервера сейчас
            dispatch("glb_incLoading");                        // увеличиваем счетчик общих загрузок с сервера
            commit(`${MC}_SET_LOADING_STATE`, true);                // выставляем флаг загрузки с сервера для модуля

            Vue.prototype.$api.getItems(apiUrls.apiUrlItems(`?maxRows=10&hasErrors=true`)) // грузим данные
            .then(res=>{  // успех
                var items = res.result
                if(!isNullOrUndefined(items)) { // если данные есть
                    commit(`${MC}_PUSH_ITEMS`       , items);  // пушим в стейт 
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
        })
    },
  
}

const mutations = {
    [`${MC}_PUSH_ITEMS`] : function(state, value){
        state._items = value;
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