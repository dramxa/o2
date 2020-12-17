import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';

const moduleName = 'ds'

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
                     },
            'dst'  : {}
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
  