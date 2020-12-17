import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import bus from '@/modules/_system/_extension/_bus'

import { mapGetters } from 'vuex';
import utilites from '@/utilites';

const moduleName = 'calcGrp'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { 
            'vm'  : { },
            'grp' : { }
        }
    }},
    
    computed:{
        ...mapGetters([moduleName + '_loading']),

        loadingState(){
            return this[moduleName + '_loading'];
        }
    },

    methods:{
        beforeCallRestrictions(items, pushFnc){ },

        websocketUpdate(wsItem, itemsAll, pushFnc) { },

        afterSendUndelivered(store){
            //store.dispatch('calcGrp_clearData');
        },
        
        beforeUpdateRestriction(message, store){
            store.dispatch('calcGrp_clearData').then(r=>{
                if(message.from=='vm' || message.from=='grp')
                {
                    store.dispatch(`${moduleName}_getItems`).then(k=>{
                        var itemsAll = this.getSelfItems();
                        bus.$emit('responseTo-all',  { from: moduleName, key: this.selfItemKey, items: itemsAll })            
                    });
                }
            });
        }
    }
})

export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  