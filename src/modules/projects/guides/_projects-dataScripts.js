


import Vue      from 'vue'
const moduleCode = 'prj'
const store = Vue.prototype.$store

const data = {
    store_items: [{
        "id"         : "BB36B408-908D-4AE1-BA7F-51DE1FAC1F17",
        "name"       : "Демо проект",
        "description": "Тестовый проект для демонстрации",
        "comment"    : "Проект будет удален после демонстрации",
        "createDate" : "2020-03-12T11:34:19Z",
        "expiryDate" : "2020-05-20T00:00:00Z",
        "groupsCount": 1,
        prep  : {
            createDateFormatted: "12.03.2020",
            expiryDateFormatted: "20.05.2020",

            groupCount : 1,
            vmCount    : 15, 
            vmErrors   : 1, 
            vmBusy     : 9, 
            vmReady    : 5,
            statuses   : ['error', 'busy'],
            cpuTotal   : 43, 
            ramTotal   : 20480, 
            ramTotalFormatted : "20 480", 
            runningTotal   : 6, 
            suspendedTotal : 1, 
            stoppedTotal   : 8,
            price          : 0,
            prices         : { 
                "RUB" : {
                            "code"        :"RUB",
                            "name"        :"RUB",
                            "letter"      :"₽",
                            "price"        :562.0351137343741,
                            "pricePerHour" :562.0351137343741,
                            "pricePerDay"  :13488.84272962502,
                            "pricePerMonth":418154.12461837474,
                            "priceTotalFormatted"        :"562,04 ₽",
                            "priceTotalPerHourFormatted" :"562,04 ₽",
                            "priceTotalPerDayFormatted"  :"13 488,84 ₽",
                            "priceTotalPerMonthFormatted":"418 154,12 ₽"
                        },
                "USD" :{
                    price: 0
                },

                "EUR" :{
                    price: 0
                }
            },
            priceListName  : 'TestPrice'           
        }
    }],

    createObjFilled:{        
        name        : 'Демо проект',
        description : 'Тестовый проект для демонстрации',
        comment     : 'Проект будет удален после демонстрации',
        expiryDate  : '2020-05-20T00:00:00Z'
    },
}

const functions = {
    clearList: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, []);
    },   

    fillList: async function(){
        await store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
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
