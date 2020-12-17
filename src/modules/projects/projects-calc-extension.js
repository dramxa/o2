import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';
import utilites from '@/utilites';
import bus from '@/modules/_system/_extension/_bus'

const moduleName = 'calcPrj'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { 
            'vm'  : { },
            'grp'  : { },
            'prj'  : { }
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
            // store.dispatch('calcPrj_clearData');
        },

        beforeUpdateRestriction(message, store){
            store.dispatch('calcPrj_clearData').then(r=>{
                if(message.from=='vm' || message.from=='grp'|| message.from=='prj')
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
  