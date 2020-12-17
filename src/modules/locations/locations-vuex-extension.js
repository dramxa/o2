import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';
import utilites from '@/utilites';

const moduleName = 'lctn'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { }
    }},
    
    computed:{
        ...mapGetters([moduleName + '_loading']),

        loadingState(){
            return this[moduleName + '_loading'];
        }
    },

    methods:{
        beforeCallRestrictions(items, pushFnc){ },

        websocketUpdate(wsItem, itemsAll, pushFnc) { }
    }
})

export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  