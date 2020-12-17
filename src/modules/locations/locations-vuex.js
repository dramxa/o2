// Модуль vuex. 
// Работа с Физическим расположением ВМ
// ServiceProvider->Datacenter->ResourceProfile
import Vue from 'vue'
import extBus from '@/modules/_system/_extension/_bus'

const api_url_items  = function(postfix = '')  { return "v1.0/locations/" + postfix;  };

const moduleCode = 'lctn';

const treeToFlat = function(tree){
  let items = tree.reduce((r, v)=>{
    Vue.set(v, "prep", {});
    Vue.set(v.prep, "serviceProviderId", v.id);
    Vue.set(v.prep, "type", "serviceProvider");
    r[v.id] = v;
    v.datacenters.forEach(dc=>{
      Vue.set(dc, "prep", {});
      Vue.set(dc.prep, "serviceProviderId", v.id);
      Vue.set(dc.prep, "type", "datacenter");
      r[dc.id] = dc;
      dc.resourceProfiles.forEach(sp=>{
        Vue.set(sp, "prep", {});
        Vue.set(sp.prep, "serviceProviderId", v.id);
        Vue.set(sp.prep, "datacenterId", dc.id);
        Vue.set(sp.prep, "type", "resourceProfile");
        r[sp.id] = sp;
      })
    })
    return r;
  }, {});
  
  return items
}


const state = {
  _firstLoad            : true,

  _lctn_serviceProviders : [],
  _lctn_datacenters      : [],
  _lctn_resourceProfiles : [],

  _lctn_loading          : false, 
  _lctn_property         : null, 
  _lctn_edited           : null,

  _lctn_defaultResourceProfile : null
}

const getters = {
  lctn_firstLoad        : state    => state._firstLoad,

  lctn_itemsAll         : state    => state._lctn_resourceProfiles,
  lctn_serviceProviders : state    => state._lctn_serviceProviders,
  lctn_resourceProfiles : state    => state._lctn_resourceProfiles,
  lctn_loading          : state    => state._lctn_loading,

  lctn_editMode         : state    => !isNullOrUndefined(state._lctn_edited),
  lctn_edited           : state    => state._lctn_edited,
  lctn_showProperty     : state    => state._lctn_property,

  lctn_defaultResourceProfile : state    => state._lctn_defaultResourceProfile    
}

const actions = {
    // получение объектов с сервера
    lctn_getItemsEmulate: async ({commit, getters, dispatch }, sProviders) => {
        // разбиваем на списки, дополняем данными о родителях и конвертируем в KeyValuePair
        dispatch('lctn_prepareItems',sProviders)
    },

    // получение объектов с сервера
    lctn_getItems: async ({commit, getters, dispatch }) => {
      if (getters.lctn_loading || getters.guide_show) return;
        
        await dispatch("glb_incLoading");

        commit("LCTN_SET_LOADING_STATE", true);
        // разбиваем на списки, дополняем данными о родителях и конвертируем в KeyValuePair
        var sProviders = await Vue.prototype.$api.getItems(api_url_items(''));
        dispatch('lctn_prepareItems',sProviders);
        dispatch('lctn_setShowProperty', sProviders[0].id);

        commit("LCTN_SET_LOADING_STATE", false);

        await dispatch("glb_decLoading");

    },

     // получение объектов с сервера
     lctn_prepareItems: async ({commit}, sProviders) => {

      // разбиваем на списки, дополняем данными о родителях
      var resourceProfiles = [];

      sProviders.forEach(provider => {
          provider.datacenters.forEach(datacenter=>{
              datacenter.resourceProfiles.forEach(resourceProfile=>{
                  let rp={};
                  rp.id = resourceProfile.id;
                  rp.isLocked = resourceProfile.isLocked;
                  rp.serviceProvider={};
                  rp.serviceProvider.id = provider.id;
                  rp.serviceProvider.isLocked = provider.isLocked;
                  rp.serviceProvider.name = provider.name;
                  rp.datacenter={};
                  rp.datacenter.id = datacenter.id;
                  rp.datacenter.name = datacenter.name;
                  rp.datacenter.isLocked = datacenter.isLocked;
                  rp.resourceProfile={};
                  rp.resourceProfile.id = resourceProfile.id;
                  rp.resourceProfile.isLocked = resourceProfile.isLocked;
                  rp.resourceProfile.name = resourceProfile.name;
                  rp.fullPath = 
                      provider.name + ' / ' 
                      + datacenter.name + ' / ' 
                      + resourceProfile.name;
                  resourceProfiles.push(rp);
                  })
          });
      });
      commit('LCTN_SET_FIRST_LOAD')
      commit("LCTN_PUSH_SERVICE_PROVIDERS", sProviders);
      commit("LCTN_PUSH_RESOURCE_PROFILES", resourceProfiles);

      extBus.$emit('update-self-restriction-' + moduleCode);
    },

    lctn_setDefaultResourceProfile: async ({commit, getters, dispatch}, id) => {
      if(isNullOrUndefined(getters.lctn_resourceProfiles))
          await dispatch('lctn_getItems');

      var item = getters.lctn_resourceProfiles.find(f=>f.resourceProfile.id==id);
      Vue.ls.set('defaultResourceProfile' , JSON.stringify(item));
      commit('LCTN_SET_DEFAULT_RESOURCE_PROFILE', item);
    },

    lctn_getDefaultResourceProfile: async ({commit, getters, dispatch}, id) => {
      var lsDefPr = Vue.ls.get('defaultResourceProfile');
      if(isNullOrUndefined(lsDefPr))
        return;

      commit('LCTN_SET_DEFAULT_RESOURCE_PROFILE', JSON.parse(lsDefPr));
    },

    lctn_changeItemLockState: async ({getters, dispatch}) => {
      var id = getters.lctn_showProperty.id;
      var lockState = !getters.lctn_showProperty.isLocked;
      var tree = clone(getters.lctn_serviceProviders);
      // приводим дерево к линейному списку с ключами по id. к каждому объекту добавляем serviceProviderId рута
      var items = treeToFlat(tree);
      var item = items[id];

      if(isNullOrUndefined(item))
        return;
      
      Vue.prototype.$windows.showDialog({
          dialogCode: 'confirmDialog',
          props: {
            textConst    : lockState ? 'lctn_lock' : 'lctn_unlock',
            objArray     : [ item.name ]                    
          },
  
          onAccept: function(){
            item.isLocked = lockState;
            let serviceProviderId = item.prep.serviceProviderId;
            Object.values(items).forEach(item=>delete item.prep);
            let branch = items[serviceProviderId];
            Vue.prototype.$api.putItem(api_url_items(`serviceprovider/${serviceProviderId}`), branch)
            .then(res=>{
              showMessage('changeLockState', { subjectName : item.name });
              dispatch('lctn_getItems');
            });   
          } // -- onAccept
      }) // -- Vue.prototype.$windows.showDialog 
    },


    lctn_applyChangesConfirm: async ({getters, dispatch}) => {
      // объект до изменений
      var nativeItem = getters.lctn_showProperty;
      // измененный объект
      var itemEdited = getters.lctn_edited;

      Vue.prototype.$windows.showDialog({
          dialogCode: 'confirmDialog',

          props: {
            textConst    : 'confirmChanges',
            objArray     : [ nativeItem.name ]                    
          },

          onAccept: function(){
            // дерево
            var tree = clone(getters.lctn_serviceProviders);
            var items = treeToFlat(tree);
            // объект в дереве
            var item = items[nativeItem.id];
            if(isNullOrUndefined(item))
              return;
            
            var serviceProviderId = item.prep.serviceProviderId;
            // применяем изменения в объект дерева (через assign нельзя, нарушится связь между проксями объектов и prep не удалится, поскольку lctn_edited это изолированная копия объекта)
            item.name = itemEdited.name;
            item.site = itemEdited.site;
            item.description = itemEdited.description;

            // получаем ветку с редактируемым объектом
            Object.values(items).forEach(item=>delete item.prep);
            console.log(items)
            let branch = items[serviceProviderId];
            // применяем изменения
            Vue.prototype.$api.putItem(api_url_items(`serviceprovider/${serviceProviderId}`), branch)
            .then(res=>{
              showMessage('editSuccess', { subjectName : item.name });
              dispatch('lctn_getItems');
            });   

          } // -- onAccept
      }) // -- Vue.prototype.$windows.showDialog 

    },

    lctn_deleteConfirm: async ({getters, dispatch}) => {
      // объект
      var nativeItem = getters.lctn_showProperty;
      var tree = clone(getters.lctn_serviceProviders);
      var item = treeToFlat(tree)[nativeItem.id];

      Vue.prototype.$windows.showDialog({
          dialogCode: 'confirmDialog',

          props: {
            textConst    : 'delete',
            objArray     : [ nativeItem.name ]                    
          },

          onAccept: function(){
            // применяем изменения
            var res = null;
            console.log(item)
            if(item.prep.type == "serviceProvider")
              res = Vue.prototype.$api.deleteItem(api_url_items(`serviceprovider/${item.id}`));

            if(item.prep.type == "datacenter")
              res = Vue.prototype.$api.deleteItem(api_url_items(`serviceprovider/${item.prep.serviceProviderId}/datacenter/${item.id}`));

            if(item.prep.type == "resourceProfile")
              res = Vue.prototype.$api.deleteItem(api_url_items(`serviceprovider/${item.prep.serviceProviderId}/datacenter/${item.prep.datacenterId}/resourceprofile/${item.id}`));

            res.then(res=>{
              dispatch('lctn_getItems');
            });   

          } // -- onAccept
      }) // -- Vue.prototype.$windows.showDialog 

    },


    lctn_setFilter: async ({getters}, data) => {}, // заглушка

    lctn_setShowProperty: async ({getters, commit}, id) => {
      var tree = clone(getters.lctn_serviceProviders);
      var item = treeToFlat(tree)[id];
      if(isNullOrUndefined(item))
        return;
      
      commit('LCTN_SET_SHOW_PROPERTY', item);
    },

    lctn_setEdited: async ({getters, commit}, value)=>{
      commit('LCTN_SET_EDITED', value ? clone(getters.lctn_showProperty) : null );
    }
}

const mutations = {
  LCTN_SET_EDITED (state, value) {
    state._lctn_edited = value;
  },

  LCTN_SET_SHOW_PROPERTY (state, item) {
    state._lctn_property = item;
  },

  LCTN_SET_FIRST_LOAD (state) {
    state._firstLoad = false;
  },

  LCTN_SET_LOADING_STATE (state, value) {
    state._lctn_loading = value;
  },

  LCTN_PUSH_SERVICE_PROVIDERS (state, items) {
    state._lctn_serviceProviders = items;
  },

  LCTN_PUSH_RESOURCE_PROFILES (state, items) {
    state._lctn_resourceProfiles = items;
  },

  LCTN_SET_DEFAULT_RESOURCE_PROFILE (state, value) {
    state._lctn_defaultResourceProfile = value;
  },
}

export default {
    state,
    getters,
    actions,
    mutations
}
  