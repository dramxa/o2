


import Vue      from 'vue'
const moduleCode = 'dst'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id": "FA84820C-CB17-4725-B6C3-9E64F9098F61",
        "name" : "SAS",
        "code" : "SAS",
        "description": ""
    }],

    createObjFilled:{
        "id":"FA84820C-CB17-4725-B6C3-9E64F9098F61",
        "name":"SAS",
        "code":"SAS",
        "description":"",
        "prep":{
     
        }
     },

}

const functions = {
    clearList: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, []);
    },   

    fillList: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
    },
    
    showDetails: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
        store.dispatch(`${moduleCode}_setShowProperty`, data.store_items[0].id)
    },

    editMode : function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
        store.dispatch(`${moduleCode}_setEdited`, data.store_items[0].id);
    },

    create : function(){
        store.dispatch(`${moduleCode}_create`);
    },

    createFilled : function(){
        store.dispatch(`${moduleCode}_create`, data.createObjFilled);
    },

}

export default { moduleCode, functions }
