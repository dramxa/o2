import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';

const moduleName = 'lmt'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: {             
            'prj'  : { 
                'key' : 'prep.projectId', 
                'name': 'prep.projectName' 
            },
            
            'grp'  : { 
                'key' : 'prep.groupId'  , 
                'name': 'prep.groupName'   
            },

            'lctn' : { 
                'key'            : 'prep.resourceProfileId',
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
                if(isNullOrUndefined(item.keyAttributes))
                    Vue.set(item, 'keyAttributes', []);
                if(item.keyAttributes.some(f=>f.code=='resourceProfile'))
                    Vue.set(item.prep, 'resourceProfileId', item.keyAttributes.find(f=>f.code=='resourceProfile').valueId);
                if(item.keyAttributes.some(f=>f.code=='group'))
                    Vue.set(item.prep, 'groupId', item.keyAttributes.find(f=>f.code=='group').valueId);
                if(item.keyAttributes.some(f=>f.code=='project'))
                    Vue.set(item.prep, 'projectId', item.keyAttributes.find(f=>f.code=='project').valueId);
                                        
                Vue.set(item.prep, 'createDateFormatted', formatDate(item.createDate));
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
  