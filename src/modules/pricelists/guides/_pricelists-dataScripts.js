


import Vue      from 'vue'
const moduleCode = 'prc'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"498AE3D2-4664-44B4-A3D8-7DAFDFD06CC7",
        "projectId" : 'BB36B408-908D-4AE1-BA7F-51DE1FAC1F17',
        "groupId"   : '498AE3D2-4664-44B4-A3D8-7DAFDFD06CC7',
        "name"      : "Демо прайслист",
        "description":"Прайслист для демонстрации",
        "createDate":"2019-12-11T11:17:37Z",
        "currencyCode":"RUB",
        "resourceProfileId":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
        "isProviderPrice":true,
        "services":[
           {
              "serviceCode":"cpu",
              "history":[
                 {
                    "price":0.5625,
                    "dateFrom":"2019-12-11"
                 },
                 {
                    "price":0.7625,
                    "dateFrom":"2018-10-01"
                 }
              ]
           },
           {
              "serviceCode":"ram",
              "history":[
                 {
                    "price":0.402777,
                    "dateFrom":"2019-12-11"
                 },
                 {
                    "price":0.402777,
                    "dateFrom":"2018-10-01"
                 }
              ]
           },
           {
              "serviceCode":"sas",
              "history":[
                 {
                    "price":0.009722,
                    "dateFrom":"2019-12-11"
                 },
                 {
                    "price":0.019722,
                    "dateFrom":"2018-10-01"
                 }
              ]
           },
           {
              "serviceCode":"sata",
              "history":[
                 {
                    "price":0.003055,
                    "dateFrom":"2019-12-11"
                 },
                 {
                    "price":0.002055,
                    "dateFrom":"2018-10-01"
                 }
              ]
           },
           {
              "serviceCode":"ssd",
              "history":[
                 {
                    "price":0.024305,
                    "dateFrom":"2019-12-11"
                 },
                 {
                    "price":0.034305,
                    "dateFrom":"2018-10-01"
                 }
              ]
           },
           {
              "serviceCode":"winlic",
              "history":[
                 {
                    "price":1.38875,
                    "dateFrom":"2019-12-11"
                 },
                 {
                    "price":1.48875,
                    "dateFrom":"2018-10-01"
                 }
              ]
           },
           {
              "serviceCode":"edge",
              "history":[
                 {
                    "price":1.714583,
                    "dateFrom":"2019-12-11"
                 },
                 {
                    "price":1.724583,
                    "dateFrom":"2018-10-01"
                 }
              ]
           }
        ],
        "prep":{
           "createDateFormatted":"11.12.2019",
           "projectName" : "Демо проект",
           "groupName" : "Демо группа",
           "letter":"₽",
           "prices":{
              "cpu":0.5625,
              "ram":0.402777,
              "sas":0.009722,
              "sata":0.003055,
              "ssd":0.024305,
              "winlic":1.38875,
              "edge":1.714583
           },
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
        name        : 'Демо прайслист',
        description : 'Тестовый прайслист для демонстрации',
        projectId   : 'BB36B408-908D-4AE1-BA7F-51DE1FAC1F17',

    }
}

const functions = {
   clearList: function(){
      store.dispatch(`${moduleCode}_getItemsEmulate`, []);
   },   

   fillList: function(){
      store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
   }, 
   
   createFilled : function(){
      store.dispatch(`${moduleCode}_create`, data.createObjFilled);
   },

   editMode : function(){
     store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
     store.dispatch(`${moduleCode}_setEdited`, data.store_items[0].id);
   },

}

export default { moduleCode, functions }
