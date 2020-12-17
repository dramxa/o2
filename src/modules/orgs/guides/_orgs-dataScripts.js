


import Vue      from 'vue'
const moduleCode = 'org'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"DC620FCF-D9F9-4239-8017-C7B8000C1057",
        "code":"demo",
        "name":"Демо организация",
        "fullName":"Демонстрационная организация",
        "comment":"Организация будет удалена после демонстрации",
        "createDate":"2011-11-18",
        "isBlocked":true,
        "projectsCount":1,
        "groupsCount":1,
        "prep":{
           "createDateFormatted":"18.11.2011"
        }
     }],

    createObjFilled:{        
        code        : 'demo',
        name        : 'Демо организация',
        fullName    : 'Демонстрационная организация',
        isBlocked   : true,
        comment     : 'Организация будет удалена после демонстрации',
    }
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
    }
}

export default { moduleCode, functions }
