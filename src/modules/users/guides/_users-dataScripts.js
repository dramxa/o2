


import Vue      from 'vue'
const moduleCode = 'usr'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"849bf8f4-20e9-4864-ab65-c52fa1a90caa",
        "orgId":"ab97aecf-adee-43a6-8777-56aa4c53b4a9",
        "login":"demo",
        "domain":"System",
        "email":"ivan@gmail.com",
        "firstName":"Иван",
        "lastName":"Иванов",
        "middleName":"Иванович",
        "createDate":"2020-04-10T20:19:30.216Z",
        "isBlocked":true,
        "isDeleted":false,
        "roles":[
           "6f1c4404-791f-44bb-9aac-e2bda5fa7222"
        ],
        "prep":{
           "createDateFormatted":"11.04.2020",
           "userLetters":"ii",
           "nameShort":"Ivanov I.",
           "nameFull":"Иванов Иван Иванович"
        }
     }],

    createObjFilled:{
        "login":"demoUser",
        "domain":"Demo",
        "email":"demo@email.com",
        "firstName":"Иван",
        "lastName":"Иванов",
        "middleName":"Иванович",
        "isBlocked":true,
        "password":"0000",
        "roles":[
           "6f1c4404-791f-44bb-9aac-e2bda5fa7222",
        ],
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
