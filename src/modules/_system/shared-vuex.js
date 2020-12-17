import Vue from 'vue'
import extBus from '@/modules/_system/_extension/_bus'

// общие ф-ии
const clone = function(obj){ return JSON.parse(JSON.stringify(obj)); };
const isNullOrUndefined = (value) => value === null || value === undefined;


// стейты
const shareState = {
  mc                : '',     // mc - moduleCode lower
  MC                : '',     // MC - moduleCode UPPER
  apiUrlItem        : null,
  apiUrlItems       : null,  


  _filter           : {},      // фильтры вывода
  _emptyFilter      : {},      // фильтры вывода
  _filterFnc        : null,


  _firstLoad        : true,
  _items            : [],      // список объектов с сервера
  _itemsSelected    : [],      // список идентификаторов выбранных объектов
  _showPropertyId   : null,    // идентификатор объекта для просмотра свойств    
  _edited           : null,    // объект редактируемый в данный момент
  _editedApplying   : false,   // признак обмена данными с сервером
  _loading          : false,   // признак загрузки 

  _putInCache       : false,
  _cache            : null, 
  _reactiveState    : [],

  _getUnreachable   : false
}

// маппинг стейтов, без префикса с добавлением фильтров
export function mapShareState(moduleCode, filters, apiUrls, emptyObject){
  let res = clone(shareState)
  res._emptyFilter = filters.filter;
  res._filter      = clone(filters.filter);
  res._filterFnc   = filters.applyFilter;
  res._emptyObject = emptyObject

  res.apiUrlItem   = apiUrls.apiUrlItem;
  res.apiUrlItems  = apiUrls.apiUrlItems; 
  res.mc            = moduleCode;
  res.MC            = moduleCode.toUpperCase();

  return res;
}


// геттеры
const shareGetters = {
  _firstLoad        : state => state._firstLoad,
  _itemsAll         : state => state._items,   /** весь список объектов переданных с сервера */
  
  _itemsFiltered    : state  => state._items.filter(item=>state._filterFnc(item, state._filter)), /** список объектов с примененной фильтрацией */
  _filter           : state  => state._filter,
  _emptyFilter      : state  => state._emptyFilter,

  _itemsSelected    : state  => state._itemsSelected,   /** список идентификаторов выделенных объектов */   
  _showPropertyId   : state  => state._showPropertyId,  /** объект для просмотра свойств */
  _showProperty     : state  => state._items.find( item => item.id == state._showPropertyId ),  /** объект для просмотра свойств */

  _edited           : state  => state._edited,  /** объект редактируемый в данный момент */
  _editMode         : state  => !isNullOrUndefined(state._edited),  /** режим редактирования включается при наличии объекта редактирования */
  _editNewObject    : state  => !isNullOrUndefined(state._edited) && isNullOrUndefined(state._edited.id) ? true : false,  /** признак, что идет создание объекта*/

  _editedApplying   : state  => state._editedApplying, /** признак отправки данных на сервер */
  _loading          : state  => state._loading,        /** происходит обмен данными с сервером */
  _reactiveState    : state  => state._reactiveState,

  _getUnreachable   : state  => state._getUnreachable
}

// маппинг геттеров, с префиксом
export function mapShareGetters(moduleCode){
  var src = {...shareGetters}
  let keys = Object.keys(src);
  var res = {};
  keys.forEach(k=>{
      res[`${moduleCode}${k}`] = src[k]
  });
  return res;
}


const shareActions = {
    /** ф-я эмуляции получения данных с сервера  */
  _getItemsEmulate: async ({state, getters, commit, dispatch}, items) => {
      //items.forEach(item=>{ if(isNullOrUndefined(item.prep)) Vue.set(item, 'prep', {}); }) // добавляем в объект параметр, где будут все скалькулированные данные
      commit(`${state.MC}_PUSH_ITEMS`       , items);         // пушим в стейт 
     // commit(`${state.MC}_SET_LOADING_STATE`, false);         // убираем флаг загрузки данных с сервера для модуля
      commit(`${state.MC}_SET_FIRST_LOAD`)                    // выставляем флаг что первая загрузка данных с сервера прошла
     // extBus.$emit(`update-self-restriction-${state.mc}`);    // шлем в шину сообщение что нужно дополнить данные зависимостей из других модулей
     // dispatch("glb_decLoading");                             // уменьшаем счетчик общих загрузок с сервера
  },

  /** ф-я получения данных с сервера  */
  _getItems: function ({state, getters, commit, dispatch}) {
    return new Promise( resolve => {
        if(getters[`${state.mc}_loading`] || getters.guide_show) return resolve();     // проверяем загружаются ли данные с сервера сейчас
        dispatch("glb_incLoading");                    // увеличиваем счетчик общих загрузок с сервера
        commit(`${state.MC}_SET_LOADING_STATE`, true); // выставляем флаг загрузки с сервера для модуля

        Vue.prototype.$api.getItems(state.apiUrlItems()) // грузим данные
          .then(items=>{  // успех
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
  
  _getItem: function({state}, id){
    return Vue.prototype.$api.getItem(state.apiUrlItem(id));
  },

  /**  замена текущего списка выделенных объектов */ 
  _setSelectedItems: async ({state, commit}, value) => {
    if(isNullOrUndefined(value))
      value = []
    commit(`${state.MC}_SET_SELECTED_ITEMS`, value);
  },

  /** открываем панель свойств объекта и выводим информацию о нем */
  _setShowProperty: async ({state, getters, commit, dispatch}, id) => {        
    if(isNullOrUndefined(id)){                // скрываем, если передали null
        await dispatch("glb_setShowProperties", false);
        commit(`${state.MC}_SET_EDITED`, null);   // отменяем редактирование
        commit(`${state.MC}_SET_SHOW_PROPERTY_ID`,  null);
        return;
    }
    commit(`${state.MC}_SET_EDITED`, null);   // отменяем редактирование

    if(getters[`${state.mc}_loading`]){
    var timeout = (ms)=>{ return new Promise(resolve => setTimeout(resolve, ms)); }        
    while(getters[`${state.mc}_loading`] == true){ await timeout(100);}
    }

    commit(`${state.MC}_SET_SHOW_PROPERTY_ID`, id);
    dispatch("glb_setShowProperties", true);
  },

  /**  установка фильтрации списка */
  _setFilter: async ({state, getters, commit, dispatch}, filter) => {
    if(isNullOrUndefined(filter) || isNullOrUndefined(filter.use))
    {  
      await dispatch("glb_incLoading");
      var newFilter = getters[`${state.mc}_emptyFilter`];
      commit(`${state.MC}_SET_FILTER`, clone(newFilter));
      await dispatch("glb_decLoading");
      return
    }
    Vue.prototype.$nav.setFilter(filter);   
    commit(`${state.MC}_SET_FILTER`, filter);
  },

  _createFrmObject: async ({state, getters, commit, dispatch}, id) => {
    let item = getters[`${state.mc}_itemsAll`].find(item => item.id == id);
    let newObj = clone(item);
    delete newObj.id;
    //delete newObj.prep;
    
    if(!isNullOrUndefined(newObj.name))
      newObj.name += ' clone';

    dispatch(`${state.mc}_create`, newObj);
  },
  
  /**  выбор объекта для редактирования по ID */
  _create: async ({state, getters, commit, dispatch}, extraProps) => {
    var item = null;

    if(isNullOrUndefined(extraProps))
      extraProps = {};

    var emptyObject = clone(state._emptyObject); 
    item = {...emptyObject, ...extraProps};
    if(isNullOrUndefined(item.prep))
      Vue.set(item, 'prep', {})    
    Vue.set(item.prep, 'oldName', 'New item') 
    commit(`${state.MC}_SET_EDITED`, item);
    
    await dispatch("glb_setShowProperties", true);
  }, 

  /**  выбор объекта для редактирования по ID */
  _setEdited: async ({state, getters, commit, dispatch}, id) => {
    var item = null;
    if(isNullOrUndefined(id))
    {
      commit(`${state.MC}_SET_EDITED`, null);
      return;
    }

    // идет редактирование объекта
    item = getters[`${state.mc}_itemsAll`].find(item => item.id == id);
    if(isNullOrUndefined(item.prep.oldName))
      Vue.set(item.prep, 'oldName', item.name) 
    else
      item.prep.oldName = item.name;

    let eitem = Object.assign(clone(item)); 
    await dispatch(`${state.mc}_setShowProperty`, id); 
    commit(`${state.MC}_SET_EDITED`, eitem);

    await dispatch("glb_setShowProperties", true);
  }, 

  /**  отправка изменений на сервер */
  _applyChangesConfirm: function ({state, getters, commit, dispatch}) {
    return new Promise(resolve => {

    let isNewObject = getters[`${state.mc}_editNewObject`];
    let oldItemName = isNewObject ? getters[`${state.mc}_edited`].name : getters[`${state.mc}_edited`].prep.oldName;
    let newItemName = getters[`${state.mc}_edited`].name;
    let name = oldItemName != newItemName ? `${oldItemName} -> ${newItemName}`: oldItemName;

    Vue.prototype.$windows.showDialog({

        dialogCode: 'confirmDialog',

        props: {
          textConst    : isNewObject ? 'confirmCreate' : 'confirmChanges',
          objArray     :  [ name ]
        },

        onAccept: function(){
          commit(`${state.MC}_SET_EDITED_APPLYING`, true); // выставляем флаг что идет передача данных серверу
          var obj = clone(getters[`${state.mc}_edited`]);

          if(!isNullOrUndefined(obj.prep))   // очищаем объект от предподготовленных данных
            delete obj.prep

          let w = isNewObject ?
              Vue.prototype.$api.postItem(state.apiUrlItem(), obj)       // запрос на создание
            : Vue.prototype.$api.putItem(state.apiUrlItem(obj.id), obj); // запрос на изменение

          w.then( item=>{
            commit(`${state.MC}_SET_EDITED_APPLYING`, false);      // убираем флаг, передача данных серверу завершена
            commit(`${state.MC}_PUT_ITEM`, item);                  // изменяем объект в списке  
            extBus.$emit(`update-self-restriction-${state.mc}`);   // обновляем собственные зависимости
            extBus.$emit(`update-other-restriction-${state.mc}`);  // информируем остальных что список обновлен
            
            commit(`${state.MC}_SET_EDITED`, null);                // очищаем объект редактирования
            dispatch(`${state.mc}_setShowProperty`, item.id);      // открываем свойства сохраненного объекта
            return resolve({ confirmCanceled: false, error: null, item }) // возвращаем резльтат ф-ии (пользователь сохранил, сервер принял данные)
            // dispatch(`${state.mc}_listChanged`)              
          })
          .catch(res=>{
            commit(`${state.MC}_SET_EDITED_APPLYING`, false);      // убираем флаг, передача данных серверу завершена
            return resolve({ confirmCanceled: false, error: res }) // возвращаем резльтат ф-ии (пользователь сохранил, сервер вернул ошибку)
          })
        },

        onCancel: function(){
          return resolve({ confirmCanceled: true }) // возвращаем резльтат ф-ии (пользователь отклонил сохранение)
        }
      })
    });
  },        

  /**  отправка команд удаления на сервер с выводом окна подтверждения */
  _deleteConfirm: async ({state, getters, commit, dispatch}, item) => {
    var selectedIds = getters[`${state.mc}_itemsSelected`];

    if(!isNullOrUndefined(item)) // передаваемый объект в приоритете перед выбранными в списке
      selectedIds = [ item.id ]

    if(selectedIds.length==0)
      return;
 
    // формируем список на удаление
    let items = getters[`${state.mc}_itemsAll`].filter(itm=>selectedIds.some(id =>id==itm.id));
    
    Vue.prototype.$windows.showDialog(
      {
        dialogCode: 'confirmDialog', // тип выводимого окна (вьюха)
 
        props: {
          textConst    : 'deleteAllSelected',       // константа текста
          objArray     :  items.map(itm=>itm.name)  // список названий объектов для вывода в окне
        },
 
        onAccept: function(){ // при подтверждении удаления перебираем список, и по каждому отсылаем запрос на удаление
          selectedIds.forEach(itemId => {
              Vue.prototype.$api.deleteItem(state.apiUrlItem(itemId))
                .then(res=>{ // если запрос на удаление прошел без ошибок
                  if(isNullOrUndefined(res.statusCode)){        // если у объекта нет параметра statusCode то это простой объект
                    dispatch(`${state.mc}_deleteItem`, {id:itemId}); // удаляем его из списка
                    return;
                  }
                  
                  if(res.statusCode == 'busy'){
                    commit(`${state.MC}_PUT_ITEM`, res);
                    extBus.$emit(`update-self-restriction-${state.mc}`);
                    extBus.$emit(`update-other-restriction-${state.mc}`);
                  }
                });
          });  
          dispatch(`${state.mc}_setSelectedItems`,[]);
        }
      }) 
  },

  /** замена текущего списка объекта передаваемым */
  _pushItems: async ({state, commit}, items) => { 
    await commit(`${state.MC}_PUSH_ITEMS`, items);
  },      
  
  /** добавление объекта в список */
  _putItem: async ({state, commit}, item) => { 
    await commit(`${state.MC}_PUT_ITEM`, item);
  },  

  /** удаление объекта из списка */
  _deleteItem: async ({state, getters, commit, dispatch}, {id}) => { 
    if(!isNullOrUndefined(getters[`${state.mc}_showProperty`]) // если удаляется объект который сейчас выводится в свойствах, закрываем свойства
      && getters[`${state.mc}_showProperty`].id == id){
      commit(`${state.MC}_SET_SHOW_PROPERTY_ID`, null);
      dispatch("glb_setShowProperties", false);    
    }
    await commit(`${state.MC}_DELETE_ITEM`, id);
  },

  _putReactiveState: async ({state, commit}, item) => {
    commit(`${state.MC}_PUSH_REACTIVE_STATE`, item)
  },

  _deleteReactiveState: async ({state, commit}, rId) => {
    commit(`${state.MC}_DELETE_REACTIVE_STATE`, rId)
  }, 
}

/**
 * Ф-я маппинга всех ф-й экшенов с добавлением к имени каждой префикса модуля
 * @param {string} moduleCode Код модуля, который будет префиксом
 * @param {string[]} excludeToInner Список ф-ий которым добавится поствикс _INNER
 */
export function mapShareActions(moduleCode, excludeToInner = []){
  var src = {...shareActions}
  let keys = Object.keys(src);
  var res = {};
  keys.forEach(k=>{
      let postfix = excludeToInner.includes(k) ? '_INNER' : '';
      res[`${moduleCode}${k}${postfix}`] = src[k]
  });
  return res;
}


const shareMutations = {
  /** Выставление флага успешной первой загрузки данных с сервера */
  _SET_FIRST_LOAD (state) {
    state._firstLoad = false;
  },

  /** Выставление флага загрузки данных с сервера*/
  _SET_LOADING_STATE (state, value) {
    state._loading = value;
  },
  
  /** замена списка объектов объектами из кеша */
  _FLIP_CACHE (state) {
    state._items = state._cache;
    state._cache = null;
  },

  /** Создание/замена списка объектов, если флаг _putInCache, то списка кеша */
  _PUSH_ITEMS (state, value) {
    if(state._putInCache == false)
      state._items = value;
    else
      state._cache = value;
  },

  /** Изменение/добавление объекта в список, если флаг isDeleted то удаление из списка */
  _PUT_ITEM (state, value) {
    let item = state._items.find(item => item.id == value.id);

    if(!isNullOrUndefined(value.isDeleted) && value.isDeleted) { // если в объекте флаг - удаление
      var index = state._items.map(m => m.id).indexOf(value.id)
      if(index >= 0)
        state._items.splice(index, 1);
      return;
    }

    if(isNullOrUndefined(value.prep))
      Vue.set(value, 'prep', {});

    if(!isNullOrUndefined(item)) {
      item = Object.assign(item, value);
    }
    else {
      state._items.push(value)
    }
  },

  /** Удаление объекта из списка */
  _DELETE_ITEM (state, id) {
    let item = state._items.find(item => item.id == id);
    if(!isNullOrUndefined(item)) {          
      var index = state._items.map(m => m.id).indexOf(id)
      if(index >= 0)
        state._items.splice(index, 1);
      return;
    }
  },  

  /** Заполнить список выбранных объектов */
  _SET_SELECTED_ITEMS (state, value) {
    state._itemsSelected = value;
  },

  /** Задать объект, свойства которого будут отображатся */
  _SET_SHOW_PROPERTY_ID (state, value) {
    state._showPropertyId = value;
  },

  /** Задать фильтр списка объектов */
  _SET_FILTER (state, value) {
    state._filter = value;
  },

  /** Задает редактируемый в данный момент объект */
  _SET_EDITED (state, value) {
    state._edited = value;
  },

  /** Выставление флага статуса отправки данных на сервер */
  _SET_EDITED_APPLYING (state, value) {
    state._editedApplying = value;
  },

  /** Добавление данных в массив о объекте пришедшем по реактивности */
  _PUSH_REACTIVE_STATE (state, value) {
    state._reactiveState.push(value);
  },

  /** Удаление данных из массива о объекте пришедшем по реактивности */
  _DELETE_REACTIVE_STATE (state, value) {
    let item = state._reactiveState.find(item=>item.rId==value);
    if(!isNullOrUndefined(item))
    {          
      var index = state._reactiveState.map(m=>m.rId).indexOf(value)
      if(index>=0)
        state._reactiveState.splice(index, 1);
      return;
    }      
  },

  /** Выставление флага статуса отправки данных на сервер */
  _SET_GET_UNREACHABLE (state, value) {
    state._getUnreachable = value;
  },

}

/**
 * Ф-я маппинга всех ф-й мутаций с добавлением к имени каждой префикса модуля в upperCase
 * @param {string} moduleCode Код модуля, который будет префиксом в upperCase
 */
export function mapShareMutations(moduleCode){
  var prefix = moduleCode.toUpperCase();
  var src = {...shareMutations}
  let keys = Object.keys(src);
  var res = {};
  keys.forEach(k=>{
      res[`${prefix}${k}`] = src[k]
  });
  return res;
}
