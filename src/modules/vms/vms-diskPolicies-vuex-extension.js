import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';
import utilites from '@/utilites';

const moduleName = 'diskPolicy'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey  : 'code',
        restrictions : { },
        requests     : []
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

        pushToRequests(item) {
            this.requests.push(item)
        }
    }
})

export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  