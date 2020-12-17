


import Vue      from 'vue'
const moduleCode = 'lmt'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"4b613868-0478-4b34-a257-e83607705775",
        "name":"Демо лимит",
        "keyAttributes":[
           {
              "code":"resourceProfile",
              "valueId":"1787428d-30ab-4aa9-acbf-ac5abf9adf60"
           },
           {
              "code":"project",
              "valueId":"BB36B408-908D-4AE1-BA7F-51DE1FAC1F17"
           },
           {
              "code":"group",
              "valueId":"498AE3D2-4664-44B4-A3D8-7DAFDFD06CC7"
           }
        ],
        "isPlatformAdministrativeLimit":true,
        "isProviderLimit" : true,
        "limitItems":[
           {
              "code":"cpu",
              "value":200,
              "isActive":true
           },
           {
              "code":"ram",
              "value":18,
              "isActive":true
           },
           {
              "code":"ssd",
              "value":0,
              "isActive":false
           },
           {
              "code":"sas",
              "value":0,
              "isActive":false
           },
           {
              "code":"sata",
              "value":0,
              "isActive":false
           },
           {
              "code":"nvme",
              "value":0,
              "isActive":false
           }
        ],
        "isDeleted":false,
        "createDate":"2020-04-28T12:05:39.16Z",
        "prep":{
           "resourceProfileId":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
           "groupId":"498AE3D2-4664-44B4-A3D8-7DAFDFD06CC7",
           "projectId":"BB36B408-908D-4AE1-BA7F-51DE1FAC1F17",
           "projectName":"demo-project",
           "groupName":"demo-group",
           "createDateFormatted":"28.04.2020",
           "resourceProfile": { name: "Public Cloud" },
           "datacenter"     : { name: "Datacenter" },
           "serviceProvider": { name: "ServiceProvider" },
        }
     }],

    createObjFilled:{        
        name        : 'Демо лимит',
        limitItems  :[
            {
               "code":"cpu",
               "value":200,
               "isActive":true
            },
            {
               "code":"ram",
               "value":18,
               "isActive":true
            },
            {
               "code":"ssd",
               "value":0,
               "isActive":false
            },
            {
               "code":"sas",
               "value":0,
               "isActive":false
            },
            {
               "code":"sata",
               "value":0,
               "isActive":false
            },
            {
               "code":"nvme",
               "value":0,
               "isActive":false
            }
         ],
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
