import Vue      from 'vue'
const moduleCode = 'grp'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id":"498AE3D2-4664-44B4-A3D8-7DAFDFD06CC7",
        "projectId":"BB36B408-908D-4AE1-BA7F-51DE1FAC1F17",
        "name":"Демо группа",
        "description":"группа для демонстрации",
        "comment":"Группа будет удалена после демонстрации",
        "createDate":"2017-04-15",
        "isDeleted":false,
        "prep":{
           "createDateFormatted":"15.04.2017",
           "projectName":"demo project",
           "vmCount":97,
           "vmErrors":11,
           "vmBusy":15,
           "vmReady":71,
           "statuses":[
              "error",
              "ready",
              "busy"
           ],
           "cpuTotal":402,
           "ramTotal":827392,
           "ramTotalFormatted":"808",
           "runningTotal":46,
           "suspendedTotal":15,
           "stoppedTotal":36,
           "price":418154.12461837474,
           "pricePerHour":562.0351137343741,
           "pricePerDay":13488.84272962502,
           "pricePerMonth":418154.12461837474,
           "priceTotalFormatted":"418 154,12 ₽",
           "priceTotalPerHourFormatted":"562,04 ₽",
           "priceTotalPerDayFormatted":"13 488,84 ₽",
           "priceTotalPerMonthFormatted":"418 154,12 ₽",
           "priceListName":"primary",
           "priceListCurrency":"RUB"
        }
     }],

    createObjFilled:{        
        name        : 'Демо группа',
        description : 'Тестовая группа для демонстрации',
        comment     : 'Группа будет удалена после демонстрации',
        projectId   : 'BB36B408-908D-4AE1-BA7F-51DE1FAC1F17'
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
