import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters } from 'vuex';

const strEmpty   = (value) => !isNullOrUndefined(value)                 ?  value   : '';
const strEmptyFC = (value) => !isNullOrUndefined(value) && value.length ? value[0] : '';

const moduleName = 'usr'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { 
            'role': { }
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
                var fName = strEmptyFC(item.firstName);
                fName = fName == '' ? '' : ` ${fName}.`;
                var nameShort = `${strEmpty(item.lastName)}${fName}`
                var nameFull  = `${strEmpty(item.lastName)} ${strEmpty(item.firstName)}`
                var userLetters = `${strEmptyFC(item.lastName)}${strEmptyFC(item.firstName)}`
                Vue.set(item.prep, 'userLetters', userLetters)
                Vue.set(item.prep, 'nameShort', nameShort)
                Vue.set(item.prep, 'nameFull', nameFull)
            });  
            pushFnc(items);
        },

        websocketUpdate(wsItem, itemsAll, pushItem, putItem, deleteItem) {
            Vue.prototype.$security.checkAndUpdateUserToken(wsItem);

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
  