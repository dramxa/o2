// Модуль vuex. 
// Работа с Пользователями
import Vue from 'vue';
import extBus from '@/modules/_system/_extension/_bus'
import filtersData from './users-vuex-filter'

import { mapShareState,   mapShareGetters,
  mapShareActions, mapShareMutations } from '@/modules/_system/shared-vuex'

const apiUrls = {
  apiUrlItem  : (postfix = '')=>`v1.0/user/${postfix}`,
  apiUrlItems : (postfix = '')=>`v1.0/users/${postfix}`
}

const moduleCode = 'usr'

const emptyObject = {
  lastName    : '',
  firstName   : '',
  middleName  : '',
  login       : '',
  password    : '',
  email       : '',
  isBlocked   : false,

  roles       : []
}

const state = {
  ...mapShareState(moduleCode, filtersData, apiUrls, emptyObject),

  _currentUserId    : null
}

const getters = {
  ...mapShareGetters(moduleCode),

  usr_currentUserId    : state    => state._currentUserId,

  usr_currentUser      : state    => state._items.find(f=>f.id == state._currentUserId),
}

const actions = {
  ...mapShareActions(moduleCode, ['_applyChangesConfirm', '_deleteConfirm']), // маппим функции и кастомизируем

  /**  отправка команд удаления на сервер с выводом окна подтверждения */
  usr_deleteConfirm: async ({state, getters, commit, dispatch}, item) => {
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
          objArray     :  items.map(itm=>itm.prep.nameFull)  // список названий объектов для вывода в окне
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
        }
      }) 
  },

  /**  отправка изменений на сервер с подтверждением*/
  usr_applyChangesConfirm: async ({dispatch, getters}) => { 
    var roles = getters.usr_edited.roles;
    // Vue.prototype.$api.putItem(apiUrls.apiUrlItem(`${getters.usr_edited.id}/roles`), roles)
    // return;
    dispatch("usr_applyChangesConfirm_INNER", {module}).then(res=>{
      if(!res.confirmCanceled && isNullOrUndefined(res.error) && !isNullOrUndefined(roles)){
        Vue.prototype.$api.putItem(apiUrls.apiUrlItem(`${res.item.id}/roles`), roles) // запрос на изменение списка ролей
          .then(res=> dispatch('usr_getItems'))
          .catch(res=>{ }); // если в роли включить не удалось (сообщение не выводим, т.к. это сделает api сервис)
      }
    });
  },

  /** отправляем изменения профиля с подтверждением*/
  usr_updateProfile: function ({getters, commit}, item) {
    return new Promise( (resolve, reject)=>{
      Vue.prototype.$windows.showDialog(
        {
          dialogCode: 'confirmDialog',

          props: {
            textConst    : 'confirmChanges',
            objArray     :  [ item.name ]
          },

          onAccept: function(){
            var newItem = item;

            Vue.prototype.$api.putItem(apiUrls.apiUrlItem(newItem.id), newItem)
              .then(user=>{               
                commit('USR_PUT_ITEM', user);
                extBus.$emit(`update-self-restriction-${moduleCode}`);
                extBus.$emit(`update-other-restriction-${moduleCode}`);  
                showMessage('userProfileUpdate', { subjectName : user.nameShort });
                return resolve(true);
              })
              .catch(r=>{
                return reject();
              })
          },

          onCancel: function(){
            return resolve(false);
          }
        })
      });
  },

  /** изменение флага блокировки пользователя */
  usr_setLockState: async  ({getters, commit}, {item, lockState}) => {
    Vue.prototype.$windows.showDialog(
      {
        dialogCode: 'confirmDialog',

        props: {
          textConst    : lockState ? 'confirmLock' : 'confirmUnLock',
          objArray     :  [ item.name ]
        },

        onAccept: function(){
          var newItem = clone(item);
          newItem.isBlocked = lockState;

          Vue.prototype.$api.putItem(apiUrls.apiUrlItem(newItem.id), newItem)
            .then(user=>{
              commit('USR_PUT_ITEM', user);
              extBus.$emit(`update-self-restriction-${moduleCode}`);
              extBus.$emit(`update-other-restriction-${moduleCode}`);
                  
              showMessage('changeLockState', 
                { 
                  message:'Lock state successfully changed to - ' +  (user.isBlocked ? 'LOCKED' : 'UNLOCKED'), 
                  subjectName : user.nameShort
                });
            })
        }
      })
  },

  /** изменяем пароль пользователя */
  usr_changePassword:  async ({getters}, data) => {
    var user = getters.usr_itemsAll.find(f=>f.id == data.id)
    Vue.prototype.$api.putItem(apiUrls.apiUrlItem(data.id + '/password'), data)
      .then(srvItem =>{
        showMessage('changePassword', { subjectName :user.nameShort });
      })
  },
  
  /** сохраняем идентификатор текущего пользователя */
  usr_setCurrentUserId: async ({commit, dispatch}, id) => {
    if(!isNullOrUndefined(id))
      await dispatch('usr_getItems');
    commit('USR_SET_CURRENT_USER_ID', id);
  }
}

const mutations = {
  ...mapShareMutations(moduleCode),

  USR_SET_CURRENT_USER_ID (state, id){
    state._currentUserId = id;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}