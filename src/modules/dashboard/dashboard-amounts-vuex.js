import Vue from 'vue'

const apiUrls = {
  apiUrlItems  : (postfix = '')=>`v1.0/analytics/amounts/${postfix}`,
}

// moduleCode
const mc = 'dsbrd_amount'
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

            //getDaysInMonth
            if(from==null || to == null){
                // выставляем начальную дату - 1е число предыдущего месяца
                var fromMonth = new Date();
                fromMonth.setDate(0);
                fromMonth.setDate(1);
                from = fromMonth.toISOString().split('T')[0];

                // выставляем конечная дата - текущее число
                to = (new Date()).toISOString().split('T')[0];
            }

            Vue.prototype.$api.getItems(apiUrls.apiUrlItems(`?date_from=${from}&date_to=${to}`)) // грузим данные
            .then(items=>{  // успех
                var daysInMonth = (date)=>{
                    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                }
                try {
                items.forEach(currencyObj=>{
                    currencyObj.history.forEach(h=>{
                        let currentDate = parseISOString(h.date);
                        let prev = currencyObj.history.filter(f=>parseISOString(f.date)<currentDate && (new Date(f.date).getMonth() == currentDate.getMonth())).reduce((r,v)=>{
                            r += v.value; return r;
                        }, 0);
                        h.monthly = h.value * daysInMonth(currentDate);
                        h.estimated = prev + h.value * (daysInMonth(currentDate) - currentDate.getDate() + 1)//) * 100 ) / 100
                    });

                    let prevStartDay = new Date();
                    prevStartDay.setDate(0)
                    let lastDay =  parseISOString(currencyObj.history[currencyObj.history.length - 1].date).getDate();
                    prevStartDay.setDate(lastDay)
                    currencyObj.history = currencyObj.history.filter(f=>parseISOString(f.date) >= prevStartDay);
                })                    
                } catch (error) {
                    console.error(error)
                }

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
        }
    )
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