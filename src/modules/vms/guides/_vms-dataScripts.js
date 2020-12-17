


import Vue      from 'vue'
const moduleCode = 'vm'
const store = Vue.prototype.$store

const data = {
    store_items: [
        {
            "id": "972a85ac-fa18-4905-b0a1-815897c0b3c2",
            "hypervisorCode": "vsphere",
            "projectId": "4f7fbde6-61b4-4f9c-80fc-452014433868",
            "groupId": "DDDC9D09-1B08-44A8-A93F-6844F90CFD0C",
            "resourceProfileId": "1787428d-30ab-4aa9-acbf-ac5abf9adf60",
            "name": "_Первая ВМ Bath блаблаблаблабла",
            "osCode": "windows7Server64Guest",
            "cpu": 68,
            "ram": 512000,
            "spec": {
                "cpuHotAdd": false,
                "ramHotAdd": false
            },
            "disks": [{
                "id": "AD059704-C357-4AD8-96C8-0793B8A7B826",
                "name": "os",
                "size": 204800,
                "policyCode": "sata",
                "spec": {
                    "bus": "SCSI 0:1",
                    "controller": "LSI Logic Parallel"
                },
                "sizeFormatted": "200"
            }, {
                "id": "BD059704-C357-4AD8-96C8-0793B8A7B826",
                "name": "os",
                "size": 16777216,
                "policyCode": "ssd",
                "spec": {
                    "bus": "SCSI 0:1",
                    "controller": "LSI Logic Parallel"
                },
                "sizeFormatted": "16 384"
            }],
            "networks": [{
                "id": "B8FAC762-B53B-4304-821A-26691CBC2D35",
                "ip": "10.10.0.300",
                "mac": "AD1B9ED48523",
                "connected": false,
                "netId": null,
                "spec": {
                    "type": "paravirtual"
                }
            }],
            "mediaImageContainers": [{
                "id": "CE7BAD75-D5EF-41DE-8F32-51DC82C49122",
                "name": "en_Windows2016_STD",
                "image": {
                    "id": "D07E8D3E-2E58-41D3-AD15-5BD89B9310D1",
                    "name": "en_Windows2016_STD",
                    "size": 300
                }
            }],
            "snapshots": [{
                "id": "b88c8f2b-6652-4bbe-8f90-aa11870d5358",
                "parentId": null,
                "name": "Snapshot 17.06.2020 22:04:25",
                "description": "",
                "size": 4096,
                "isInUse": false,
                "isWithMemory": false,
                "isQuiesceGuestFS": false,
                "createDate": "2020-06-17T19:04:46.238Z",
                "disks": [{
                    "id": "e035ce13-6d52-4bdf-a40c-e8f880197222",
                    "name": "new hdd",
                    "size": 4096,
                    "policyCode": "sas",
                    "spec": {
                        "bus": "0",
                        "controller": "0"
                    }
                }],
                "sizeRam": 0,
                "policyCodeRam": "ssd"
            }, {
                "id": "4e6d8129-7a38-4b77-b4c0-e704bab3bc1a",
                "parentId": "b88c8f2b-6652-4bbe-8f90-aa11870d5358",
                "name": "Snapshot 17.06.2020 22:06:12",
                "description": "",
                "size": 6144,
                "isInUse": true,
                "isWithMemory": true,
                "isQuiesceGuestFS": false,
                "createDate": "2020-06-17T19:06:18.881Z",
                "disks": [{
                    "id": "e035ce13-6d52-4bdf-a40c-e8f880197222",
                    "name": "new hdd",
                    "size": 4096,
                    "policyCode": "sas",
                    "spec": {
                        "bus": "0",
                        "controller": "0"
                    }
                }],
                "sizeRam": 2048,
                "policyCodeRam": "ssd"
            }],

            "comment": "Тестовая ВМ",
            "tags": ["testVm", "testVm1", "testVm2"],
            "snapshotsCount": 2,
            "statusCode": "error",
            "powerStateCode": "stopped",
            "tasks": [],
            "createDate": "2018-09-27",
            "prep": {
                "ramTotal": 500,
                "ramFormatted": "500",
                "storageTotal": 82120,
                "storageTotalFormatted": "82 120",
                "createDateFormatted": "27.09.2018",
                "projectName": "№751-1",
                "groupName": "kuber",
                "osName": "Windows Server 2008 R2 x64",
                "resourceProfileFullpath":"ServiceProvider / Датацентр / Public Cloud",
                "snapshots":[
                    {
                       "id":"b88c8f2b-6652-4bbe-8f90-aa11870d5358",
                       "parentId":null,
                       "name":"Snapshot 17.06.2020 22:04:25",
                       "description":"",
                       "size":4096,
                       "isInUse":false,
                       "isWithMemory":false,
                       "isQuiesceGuestFS":false,
                       "createDate":"2020-06-17T19:04:46.238Z",
                       "disks":[
                          {
                             "id":"e035ce13-6d52-4bdf-a40c-e8f880197222",
                             "name":"new hdd",
                             "size":4096,
                             "policyCode":"sas",
                             "spec":{
                                "bus":"0",
                                "controller":"0"
                             }
                          }
                       ],
                       "sizeRam":0,
                       "policyCodeRam":"ssd",
                       "createDateFormatted":"18.06.2020",
                       "children":[
                          {
                             "id":"4e6d8129-7a38-4b77-b4c0-e704bab3bc1a",
                             "parentId":"b88c8f2b-6652-4bbe-8f90-aa11870d5358",
                             "name":"Snapshot 17.06.2020 22:06:12",
                             "description":"",
                             "size":6144,
                             "isInUse":true,
                             "isWithMemory":true,
                             "isQuiesceGuestFS":false,
                             "createDate":"2020-06-17T19:06:18.881Z",
                             "disks":[
                                {
                                   "id":"e035ce13-6d52-4bdf-a40c-e8f880197222",
                                   "name":"new hdd",
                                   "size":4096,
                                   "policyCode":"sas",
                                   "spec":{
                                      "bus":"0",
                                      "controller":"0"
                                   }
                                }
                             ],
                             "sizeRam":2048,
                             "policyCodeRam":"ssd",
                             "createDateFormatted":"18.06.2020",
                             "children":[
                                {
                                   "id":201,
                                   "name":"You are here",
                                   "isDisable":true
                                }
                             ],
                             "isDisable":false,
                             "prep":{
                                "price":{
                                   "perHour":0.08749799999999999,
                                   "perDay":2.099952,
                                   "perMonth":62.99856
                                },
                                "priceFormatted":{
                                   "perHour":"0,09 €",
                                   "perDay":"2,10 €",
                                   "perMonth":"63,00 €"
                                }
                             }
                          }
                       ],
                       "isDisable":false,
                       "prep":{
                          "price":{
                             "perHour":0.038888,
                             "perDay":0.9333119999999999,
                             "perMonth":27.999359999999996
                          },
                          "priceFormatted":{
                             "perHour":"0,04 €",
                             "perDay":"0,93 €",
                             "perMonth":"28,00 €"
                          }
                       }
                    },
                    {
                       "id":"4e6d8129-7a38-4b77-b4c0-e704bab3bc1a",
                       "parentId":"b88c8f2b-6652-4bbe-8f90-aa11870d5358",
                       "name":"Snapshot 17.06.2020 22:06:12",
                       "description":"",
                       "size":6144,
                       "isInUse":true,
                       "isWithMemory":true,
                       "isQuiesceGuestFS":false,
                       "createDate":"2020-06-17T19:06:18.881Z",
                       "disks":[
                          {
                             "id":"e035ce13-6d52-4bdf-a40c-e8f880197222",
                             "name":"new hdd",
                             "size":4096,
                             "policyCode":"sas",
                             "spec":{
                                "bus":"0",
                                "controller":"0"
                             }
                          }
                       ],
                       "sizeRam":2048,
                       "policyCodeRam":"ssd",
                       "createDateFormatted":"18.06.2020",
                       "children":[
                          {
                             "id":201,
                             "name":"You are here",
                             "isDisable":true
                          }
                       ],
                       "isDisable":false,
                       "prep":{
                          "price":{
                             "perHour":0.08749799999999999,
                             "perDay":2.099952,
                             "perMonth":62.99856
                          },
                          "priceFormatted":{
                             "perHour":"0,09 €",
                             "perDay":"2,10 €",
                             "perMonth":"63,00 €"
                          }
                       }
                    }
                 ],
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
                "priceCalcError": true,
                "priceListCurrency": "USD",
                "priceListName": "Group PriceList",
                "prcLstId": "498AE3D2-4664-44B4-A3D8-7DAFDFD06CC7",
                "priceFullTotal":{
                    "perHour":21.348981765625,
                    "perDay":512.375562375,
                    "perMonth":15371.266871249998
                 },
                 "priceFullTotalFormatted":{
                    "perHour":"21,35 €",
                    "perDay":"512,38 €",
                    "perMonth":"15 371,27 €"
                 },
                 "priceOnlyVmTotal":{
                    "perHour":21.222595765624998,
                    "perDay":509.3422983749999,
                    "perMonth":15280.268951249998
                 },
                 "priceOnlyVmTotalFormatted":{
                    "perHour":"21,22 €",
                    "perDay":"509,34 €",
                    "perMonth":"15 280,27 €"
                 },
                 "priceSnapTotal":{
                    "perHour":0.126386,
                    "perDay":3.033264,
                    "perMonth":90.99792
                 },
                 "priceSnapTotalFormatted":{
                    "perHour":"0,13 €",
                    "perDay":"3,03 €",
                    "perMonth":"91,00 €"
                 },
                 "priceTotalFormatted":"15 371,27 €",
                 "priceTotal":15371.266871249998,
            }
        }
    ],

    createObjFilled:{
        "hypervisorCode":"vsphere",
        "groupId":"c5a49aa7-5aae-428b-8fc5-ddd29ab4843e",
        "projectId":"4f7fbde6-61b4-4f9c-80fc-452014433868",
        "resourceProfileId":"1787428d-30ab-4aa9-acbf-ac5abf9adf60",
        "name":"Birmingham",
        "osCode":"windows7Server64Guest",
        "cpu":32,
        "ram":8192,
        "spec":{
           "cpuHotAdd":false,
           "ramHotAdd":false
        },
        "disks":[
           {
              "id":"AD059704-C357-4AD8-96C8-0793B8A7B826",
              "name":"os",
              "size":40,
              "policyCode":"sas",
              "spec":{
                 "bus":"SCSI 0:1",
                 "controller":"LSI Logic Parallel"
              }
           }
        ],
        "networks":[
           {
              "id":"B8FAC762-B53B-4304-821A-26691CBC2D35",
              "ip":"10.10.0.200",
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
                 "id":"D07E8D3E-2E58-41D3-AD15-5BD89B9310D1",
                 "name":"en_Windows2016_STD",
                 "size":300
              }
           }
        ],
        "comment":"Тестовая ВМ",
        "tags":[
           "testVm"
        ],
        "snapshotsCount":0,
        "statusCode":"busy",
        "powerStateCode":"stopped",
        "tasks":[
           {
              "id":"810ab799-ab1e-403b-86bc-8239cd25c5a9",
              "typeCode":"reconfigure",
              "stateCode":"created",
              "description":"disks adding",
              "percentCompleted":0,
              "dateStart":"2020-02-22T18:54:36.677Z"
           }
        ],
        "createDate":"2018-09-27",
        "prep":{
     
        }
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

   migrateDlg : function(){
      store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
      var item = store.getters.vm_itemsAll[0];
      console.log(item)
      Vue.prototype.$windows.showDialog({
         dialogCode: 'migrateVmDialog',            
         props: {
            vms: [item]
         }
         }        
      );   
   },

   showDlg : function(dialogCode){
      store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
      var item = store.getters.vm_itemsAll[0];
      Vue.prototype.$windows.showDialog({
         dialogCode: dialogCode,            
         props: {
            vms: [item]
         }
         }        
      ); 
   },

   create : function(){
      store.dispatch(`${moduleCode}_create`);
   },
   
   createFilled : function(){
      store.dispatch(`${moduleCode}_create`, data.createObjFilled);
   },
}

export default { moduleCode, functions }
