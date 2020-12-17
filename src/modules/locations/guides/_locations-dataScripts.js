


import Vue      from 'vue'
const moduleCode = 'lctn'
const store = Vue.prototype.$store

const data = {
    store_items: [
        {
            "id"  : "245807fa-942a-424a-9fcc-aaf7f51b155d",
            "name": "ServiceProvider",
            "site": "https://ServiceProvider.com",
            "description": "Сервис провайдер оказывающий большое количесво всевозможных услуг, в том числе и облачных.",
            "smallLogo": "sp-default.png",
            "bigLogo": "sp-default.png",
            "datacenters": [
                {
                    "id"  : "afff8295-9a5a-45e7-80a8-0e2839d9287a",
                    "name": "Datacenter",
                    "site": "https://datacenter.com",
                    "description": "Датацентр",
                    "smallLogo": "dc-default.png",
                    "bigLogo": "dc-default.png",
                    "resourceProfiles": [
                        {
                            "id"  : "1787428d-30ab-4aa9-acbf-ac5abf9adf60",
                            "name": "Public Cloud",
                            "site": "",
                            "description": "Публичное облако, предоставляется посредством VMware vCloud Director",
                            "smallLogo": "publicCloud.png",
                            "bigLogo": "publicCloud.png",
                            "hypervisorCode": "vmware",
                            "hypervisorVerCode": "vmware55"
                        },
                        {
                            "id"  : "144B3FF9-92E7-4AFF-B2B0-B16FB200DA0B",
                            "name": "Secret Cloud",
                            "site": "",
                            "description": "Приватное облако, предоставляется посредством VMware vCloud Director",
                            "smallLogo": "secretCloud.png",
                            "bigLogo": "secretCloud.png",
                            "hypervisorCode": "vmware",
                            "hypervisorVerCode": "vmware55"
                        }
                    ]
                }
            ]
        }
    ]
}

const functions = {
    clearList: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, []);
    },   

    fillList: function(){
        store.dispatch(`${moduleCode}_getItemsEmulate`, data.store_items);
    },
    
    setLocation: function(){
        store.dispatch(`${moduleCode}_setDefaultResourceProfile`, '1787428d-30ab-4aa9-acbf-ac5abf9adf60');
    }
}

export default { moduleCode, functions }
