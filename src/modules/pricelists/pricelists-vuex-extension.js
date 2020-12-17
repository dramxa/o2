import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';
import { currencies, currenciesCode, services } from '@/consts/pricelistConst';

const moduleName = 'prc'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: {             
            'prj'  : { 
                'key' : 'projectId', 
                'name': 'prep.projectName' 
            },

            'grp'  : { 
                'key' : 'groupId', 
                'name': 'prep.groupName'   
            },

            'lctn' : { 
                'key'            : 'resourceProfileId',
                'fullPath'       : 'prep.resourceProfileFullpath',
                'datacenter'     : 'prep.datacenter',
                'serviceProvider': 'prep.serviceProvider',
                'resourceProfile': 'prep.resourceProfile', 
            },
            
            'diskPolicy' : {  } 
        }
    }},
    
    computed:{
        ...mapGetters([moduleName + '_loading']),

        loadingState(){
            return this[moduleName + '_loading'];
        }
    },
    
    methods:{
        beforeCallRestrictions(items, pushFnc){
            items.forEach(item => {
                Vue.set(item.prep, 'createDateFormatted', formatDate(item.createDate));
                Vue.set(item.prep, 'letter', currencies[item.currencyCode].letter)
                Vue.set(item.prep, 'prices', {});
                item.services.forEach(srvc => {
                    let tempHistArr = srvc.history;
                    tempHistArr.forEach(t => {
                        if(!Number.isInteger(t.dateFrom))
                            t.dateFrom = Date.parse(t.dateFrom);
                    });
                    tempHistArr.sort((a, b) => a.dateFrom < b.dateFrom ? 1 : -1);
                    tempHistArr.forEach(t => {
                        let date = new Date(t.dateFrom);
                        let dd   = date.getDate();
                        let mm   = date.getMonth() + 1;
                        let yyyy = date.getFullYear();
                        if (dd<10)
                            dd = '0' + dd;
                        if (mm<10)
                            mm = '0' + mm;
                        t.dateFrom = yyyy + '-' + mm + '-' + dd;
                    });
                    srvc.history = tempHistArr;
                    let price = tempHistArr.length ? tempHistArr[0].price : 0;
                    Vue.set(item.prep.prices, srvc.serviceCode, price)
                });                
            });  
            pushFnc(items);
        },

        websocketUpdate(wsItem, itemsAll, pushItem, putItem, deleteItem) {
            // если пришел лбъект с флагом - удаленный
            if(!isNullOrUndefined(wsItem.isDeleted) && wsItem.isDeleted == true){
                deleteItem(wsItem)
                return;
            }

            // если объект изменился
            var index = itemsAll.map(m=>m[this.selfItemKey]).indexOf(wsItem[this.selfItemKey]);
            if(index >= 0){
                putItem(wsItem);
                return;
            }
            
            // если объект новый
            pushItem(wsItem);
        }
    }
})
 
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  