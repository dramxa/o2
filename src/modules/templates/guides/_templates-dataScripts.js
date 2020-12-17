


import Vue      from 'vue'
const moduleCode = 'tmpl'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"bc902a79-7b7a-4b6e-b7fc-f4aedfa01a17",
        "hypervisorCode":"vsphere",
        "resourceProfileId":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
        "name":"Тестовый шаблон",
        "osCode":"windows7Server64Guest",
        "cpu":32,
        "ram":2048,
        "spec":{
           "cpuHotAdd":false,
           "ramHotAdd":false
        },
        "disks":[
           {
              "id":"AD059704-C357-4AD8-96C8-0793B8A7B826",
              "name":"os",
              "size":10240,
              "policyCode":"sata",
              "spec":{
                 "bus":"SCSI 0:1",
                 "controller":"LSI Logic Parallel"
              },
              "sizeFormatted":"10"
           }
        ],
        "networks":[
           {
              "id":"B8FAC762-B53B-4304-821A-26691CBC2D35",
              "ip":"",
              "mac":"AD1B9ED48523",
              "connected":true,
              "netId":null,
              "spec":{
                 "type":"paravirtual"
              }
           }
        ],
        "mediaImageContainers":[
           {
              "id":"CE7BAD75-D5EF-41DE-8F32-51DC82C49122",
              "name":"en_Windows2016_STD",
              "image":{
                 "id":null
              }
           }
        ],
        "comment":"Тестовый шаблон 2",
        "statusCode":"ready",
        "tasks":[
     
        ],
        "createDate":"2018-09-27",
        "prep":{
           "ramTotal":2,
           "ramFormatted":"2",
           "storageTotal":10,
           "storageTotalFormatted":"10",
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
           },
           "osName":"Windows Server 2008 R2 x64",
           "priceTotalFormatted":"18,84 ₽",
           "priceTotal":18.836104000000002
        }
     }],

    createObjFilled:{        
        name        : 'Демо проект',
        description : 'Тестовый проект для демонстрации',
        comment     : 'Проект будет удален после демонстрации',
        expiryDate  : '2020-05-20T00:00:00Z'
    },

    reactive_create: {
        "id"          : "BB36B408-908D-4AE1-BA7F-51DE1FAC1F17",
        "name"        : "Демо проект 2",
        "description" : "Тестовый проект для демонстрации",
        "comment"     : "Проект будет удален после демонстрации",
        "createDate"  : "2020-03-12T11:34:19Z",
        "expiryDate"  : null,
        "groupsCount" : 0
    },

    reactive_edited: {
        "id"          : "BB36B408-908D-4AE1-BA7F-51DE1FAC1F17",
        "name"        : "Демо проект 2",
        "description" : "Тестовый проект для демонстрации",
        "comment"     : "Проект будет удален после демонстрации",
        "createDate"  : "2020-03-12T11:34:19Z",
        "expiryDate"  : "2020-05-20T00:00:00Z",
        "groupsCount" : 1
    },

    reactive_deleted: {
        "id": "BB36B408-908D-4AE1-BA7F-51DE1FAC1F17",
        "name": "Демо проект 2",
        "description": "Тестовый проект для демонстрации",
        "comment": "Проект будет удален после демонстрации",
        "createDate": "2020-03-12T11:34:19Z",
        "expiryDate": "2020-05-20T00:00:00Z",
        "groupsCount": 1
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
