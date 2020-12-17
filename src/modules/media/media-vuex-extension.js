import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';

const moduleName = 'med'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { 
            'lctn' : { 'key'            : 'resourceProfileId',
                       'fullPath'       : 'prep.resourceProfileFullpath',
                       'datacenter'     : 'prep.datacenter',
                       'serviceProvider': 'prep.serviceProvider',
                       'resourceProfile': 'prep.resourceProfile', 
                       'isLocked'       : 'prep.isLocationLocked'
                     },
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
                Vue.set(item.prep, 'createDateFormatted', formatDate(item.createDate))
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
    }
})
 
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  