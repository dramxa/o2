import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';
import { toKeyValuePair } from '@/utilites';

const moduleName = 'tmpl'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { 
            // key - идентификатор source в объекте destination
            // название модуля : { название параметра в источнике : название параметра в получателе }
            'os'   : { 
                'key' : 'osCode',
                'name': 'prep.osName' 
            },

            'lctn' : { 'key'            : 'resourceProfileId',
                       'fullPath'       : 'prep.resourceProfileFullpath',
                       'datacenter'     : 'prep.datacenter',
                       'serviceProvider': 'prep.serviceProvider',
                       'resourceProfile': 'prep.resourceProfile', 
                       'isLocked'       : 'prep.isLocationLocked'
                     },

            'prc'  : {  }   
        }
    }},
    
    computed:{
        ...mapGetters([moduleName + '_loading']),

        loadingState(){
            return this[moduleName + '_loading'];
        }
    },
    
    methods: {
        beforeCallRestrictions(items, pushFnc){
            items.forEach(item => {
                let storageTotal = Math.round( ((isNullOrUndefined(item.disks) ? 0 : item.disks.map(d=>{return d.size }).reduce((a,b) => a + b, 0)) / 1024 )* 100) / 100;
                let storageTotalFormatted = localeString(storageTotal);

                let ramTotal = Math.round(( item.ram / 1024 )* 100) / 100;
                let ramFormatted = localeString(ramTotal);

                Vue.set(item.prep, 'ramTotal', ramTotal)
                Vue.set(item.prep, 'ramFormatted', ramFormatted)

                Vue.set(item.prep, 'storageTotal', storageTotal)
                Vue.set(item.prep, 'storageTotalFormatted', storageTotalFormatted)
                Vue.set(item.prep, 'createDateFormatted', formatDate(item.createDate))
                item.disks.forEach(disk=>{
                    var size =  Math.round((disk.size / 1024 )* 100) / 100;
                    Vue.set(disk, 'sizeFormatted', localeString(size));
                });

                item.mediaImageContainers.forEach(mediaContainer=>{
                    if(isNullOrUndefined(mediaContainer.image))
                        Vue.set(mediaContainer, 'image', { id: null })
                });


            });  
            pushFnc(items);
        },


        websocketUpdate(wsItem, itemsAll, pushItem, putItem, deleteItem) {
            // console.log({wsItem, itemsAll})
            // если пришел объект с флагом - удаленный
            if(wsItem.statusCode == 'deleted'){
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
        },
        
        onUpdateRestriction(msg, allItems){
            if(msg.from=='prc')
            {
                var getVmPriceList = function(vm){
                    let vmPrcs = msg.items.filter(f=>f.resourceProfileId == vm.resourceProfileId);
                    if(vmPrcs.length == 0) // если для location вм нет никаких прайсов, выходим
                      return null;
                    let orgPrc = vmPrcs.find(f=>isNullOrUndefined(f.projectId) && isNullOrUndefined(f.groupId));
                    let prjPrc = vmPrcs.find(f=>f.projectId == vm.projectId && isNullOrUndefined(f.groupId));
                    let grpPrc = vmPrcs.find(f=>f.projectId == vm.projectId && f.groupId == vm.groupId);
                    if(!isNullOrUndefined(grpPrc))
                      return grpPrc;
                    if(!isNullOrUndefined(prjPrc))
                      return prjPrc;
                    if(!isNullOrUndefined(orgPrc))
                      return orgPrc;
                    return null; // если прайсы были, но ни один не совпал
                }

                
                allItems.forEach(item=>{
                    var prcLst = getVmPriceList(item);

                    if(isNullOrUndefined(prcLst))
                        return;

                    var price = prcLst.prep.prices['cpu'] * item.cpu;
                    price    += prcLst.prep.prices['ram'] * (item.ram / 1024);

                    item.disks.forEach(disk=>{
                        price += prcLst.prep.prices[disk.policyCode] * (disk.size / 1024);
                    })

                    let daysInMonth = getDaysInMonth();
                    
                    // Vue.set(item.prep, 'priceTotalFormatted', localePrice(price, prcLst.currencyCode));
                    // Vue.set(item.prep, 'priceTotal', price);   

                    Vue.set(item.prep, 'priceTotal', {
                        'perHour' : price,
                        'perDay'  : price * 24,
                        'perMonth': price * 24 * daysInMonth
                    });
                    Vue.set(item.prep, 'priceTotalFormatted', {
                        'perHour' : localePrice(price, prcLst.currencyCode),
                        'perDay'  : localePrice(price * 24, prcLst.currencyCode),
                        'perMonth': localePrice(price * 24 * daysInMonth, prcLst.currencyCode)
                    });
    
                    // console.log(item)
                })
            }
            // console.log(allItems)
            return allItems;
        }
    }
})
 
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  