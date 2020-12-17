import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';

const moduleName = 'vjob'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { 
            'usr' : [
                { 
                    'key'       : 'initiator.initiatorId',
                    'domain'    : 'prep.initiatorDomain',
                    'firstName' : 'prep.initiatorFirstName',
                    'lastName'  : 'prep.initiatorLastName',
                },
                { 
                    'key'       : 'acknowledge.acknowledgedUserId',
                    'domain'    : 'prep.acknowledgeDomain',
                    'firstName' : 'prep.acknowledgeFirstName',
                    'lastName'  : 'prep.acknowledgeLastName',
                }
            ]
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
                Vue.set(item.prep, 'dateStartFormatted', formatDateTime(item.dateStart));
                // let time = new Date(item.createDate);
                // let hours = time.getHours();
                // if(hours < 10)
                //     hours = '0' + hours;
                // let minutes = time.getMinutes();
                // if(minutes < 10)
                //     minutes = '0' + minutes;

                // Vue.set(item, 'createTime', hours + ':' + minutes);
                Vue.set(item.prep, 'lastTask', item.tasks.length > 0 ? item.tasks[item.tasks.length-1] : false)
            });  
            pushFnc(items);
        },

        websocketUpdate(wsItem, itemsAll, pushFnc) { }
    }
})
 
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  