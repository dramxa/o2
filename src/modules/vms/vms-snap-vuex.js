import Vue from 'vue'

export default {
    vm_getSnapshots: function({state, getters, commit, dispatch}, vmId) {
        return new Promise((resolve, reject)=>{
            dispatch("glb_incLoading"); // увеличиваем счетчик общих загрузок с сервера
            Vue.prototype.$api.getItems(state.apiUrlItem(`${vmId}/snapshots`)) // грузим данные
                .then(items=>{  // успех
                    if(!isNullOrUndefined(items)) {   // если данные есть
                        let newItemsArr = [];
                        items.forEach(item=>{  // добавляем в объект параметр, где будут все скалькулированные данные
                            Vue.set(item, 'prep', {}); 
                            Vue.set(item.prep, 'createDateFormatted', formatDate(item.createDate))
                            Vue.set(item, 'children', []);
                            Vue.set(item, 'isDisable', false)
                        })
                        
                        // строим дерево
                        var rootChildrens = []; 
                        var itemsD = items.reduce((r, e)=>{ r[e.id] = e; return r;  }, {});
                        items.forEach(item=>{                            
                            if(isNullOrUndefined(item.parentId)){
                                rootChildrens.push(item);
                                return;
                            }
                            itemsD[item.parentId].children.push(item)
                        });
                        items.find(w=>w.isInUse).children.unshift({ id: 201, name: 'You are here', isDisable: true, });
                        dispatch("glb_decLoading"); // уменьшаем счетчик общих загрузок с сервера
                        return resolve({rootChildrens, items});
                    }
                })
                .catch(res=>{ // провал
                    dispatch("glb_decLoading");                               // уменьшаем счетчик общих загрузок с сервера
                    return reject(res);
                });
        });
    },

    vm_createSnapshot: async ({state, getters, commit, dispatch}, { vmId, snap }) => {
        Vue.prototype.$api.postItem(state.apiUrlItem(`${vmId}/snapshot`), snap)
    },

    vm_editSnapshot: async ({state, getters, commit, dispatch}, { vmId, snap }) => {
        await Vue.prototype.$api.putItem(state.apiUrlItem(`${vmId}/snapshot/${snap.id}`), snap);
    },

    vm_deleteSnapshot: async ({state, getters, commit, dispatch}, { vmId, snap }) => {
        await Vue.prototype.$api.deleteItem(state.apiUrlItem(`${vmId}/snapshot/${snap.id}`));
    },

    vm_deleteAllSnapshots: async ({state, getters, commit, dispatch}, { vmId }) => {
        await Vue.prototype.$api.deleteItem(state.apiUrlItem(`${vmId}/snapshots`));
    },

    vm_revertSnapshot: async ({state, getters, commit, dispatch}, { vmId, snap }) => {
        await Vue.prototype.$api.postItem(state.apiUrlItem(`${vmId}/snapshot/${snap.id}/revert`));
    },
}