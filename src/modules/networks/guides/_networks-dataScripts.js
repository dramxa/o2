


import Vue      from 'vue'
const moduleCode = 'net'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"a73cb422-12fe-4137-a885-328fa7b05eb0",
        "resourceProfileId":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
        "orgId":"F172E5E8-84F1-49D2-AE20-C6EA8EA9B781",
        "name":"Демо сеть",
        "comment":"Сеть для демонстрации",
        "statusCode":"ready",
        "type":"public",
        "connectedVms":[
     
        ],
        "createDate":"2018-09-27",
        "prep":{
           "createDateFormatted":"27.09.2018",
           "resourceProfileFullpath":"ServiceProvider / Датацентр / Public Cloud",
           "datacenter":{
              "id":"afff8295-9a5a-45e7-80a8-0e2839d9287a",
              "name":"Датацентр"
           },
           "serviceProvider":{
              "id":"245807fa-942a-424a-9fcc-aaf7f51b155d",
              "name":"ServiceProvider"
           },
           "resourceProfile":{
              "id":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
              "name":"Public Cloud"
           }
        }
     }],

    createObjFilled:{        
        name        : 'Демо сеть',
        comment     : 'Сеть будет удалена после демонстрации',
        resourceProfileId: "1787428d-30ab-4aa9-acbf-ac5abf9adf60",
        prep        :{
            "createDateFormatted":"27.09.2018",
            "resourceProfileFullpath":"ServiceProvider / Датацентр / Public Cloud",
            "datacenter":{
               "id":"afff8295-9a5a-45e7-80a8-0e2839d9287a",
               "name":"Датацентр"
            },
            "serviceProvider":{
               "id":"245807fa-942a-424a-9fcc-aaf7f51b155d",
               "name":"ServiceProvider"
            },
            "resourceProfile":{
               "id":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
               "name":"Public Cloud"
            }
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
