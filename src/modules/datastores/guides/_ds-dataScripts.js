


import Vue      from 'vue'
const moduleCode = 'net'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id": "FA84820C-CB17-4725-B6C3-9E64F9098F61",
        "resourceProfileId" : "1787428d-30ab-4aa9-acbf-ac5abf9adf60",
        "storageTypeId" : "FA84820C-CB17-4725-B6C3-9E64F9098F61",
        "name" : "3PAR_BOB_SAS_ID30",
        "appliedTypeId": {
            "isVirtualMachine" : false,
            "isTemplate"       : true,
            "isMediaImage"     : false
        },
        "isEnabled" : true,
        "isDeleted" : false
    }],

    createObjFilled:{
        "id":"FA84820C-CB17-4725-B6C3-9E64F9098F61",
        "resourceProfileId":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
        "storageTypeId":"FA84820C-CB17-4725-B6C3-9E64F9098F61",
        "name":"3PAR_BOB_SAS_ID30",
        "appliedTypeId":{
           "isVirtualMachine": false,
           "isTemplate"      : true ,
           "isMediaImage"    : false
        },
        "isEnabled" : true,
        "isDeleted" : false,
        "prep":{
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
