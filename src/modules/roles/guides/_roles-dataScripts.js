import Vue      from 'vue'
const moduleCode = 'role'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"6f1c4404-791f-44bb-9aac-e2bda5fa7222",
        "name":"Administrator",
        "description":"Демонстрационная роль",
        "createDate":"2020-03-11T10:56:39.34Z",
        "isService":false,
        "isSystem":true,
        "isDeleted":false,
        "prep":{
           "createDateFormatted":"11.03.2020"
        }
     }],

    userStore_items: [{
        "id":"0078B748-2DDB-442B-BE1A-7A78E802455F",
        "name":"Department role",
        "description":"Клиентская демонстрационная роль",
        "createDate":"2020-03-11T10:56:39.34Z",
        "isService":false,
        "isSystem":false,
        "isDeleted":false,
        "prep":{
           "createDateFormatted":"11.03.2020"
        }
     }],

    createObjFilled:{        
        "name":"Демо роль",
        "description":"Роль для демонстрации",
        "isService":true,
        "isSystem":true
    },

}

const functions = {
    clearList: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, []);
    },   

    fillList: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
    },

    fillList2: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, data.userStore_items);
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
