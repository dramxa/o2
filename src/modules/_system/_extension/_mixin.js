import bus from './_bus'
import Vue from 'vue'
import { objectValuesToString, isArray } from '@/utilites'

const store = Vue.prototype.$store
const getPath = function(data, path){
  var obj = data;
  var value = undefined;
  var pths = path.split('.');
  for(var p of pths){    
    value =  obj[p]
    if(isNullOrUndefined(value))
      break;
    obj = value;
  }
  return value;
}



export default {
    store,

    data(){ return {
        requests     : []
    }},
    
    watch:{
        loadingState: function(state){
            if(!state){
                this.sendUndelivered();
            }
        }
    },

    methods:{
        /** реакция, при поступлении запроса на предоставление данных */
        requestData(message) {
            var fromModule = message.from;

            var itemsAll = this.getSelfItems();
            
            // if(isNullOrUndefined(itemsAll))
            //     console.error({ moduleName: this.moduleName, message, itemsAll});

            if(itemsAll.length==0 && !store.getters[this.moduleName + '_firstLoad']) // если список пуст и мы его уже пытались подгрузить
                return;

            if(itemsAll.length==0 && this.requests.indexOf(fromModule) < 0)
                this.requests.push(fromModule);

            if(itemsAll.length==0)
                store.dispatch(this.moduleName + '_getItems');

            if(!this.loadingState && itemsAll.length > 0){
                this.sendData(fromModule);
            }
        },

        sendUndelivered(){                
            this.requests.forEach(toModule => {
                this.sendData(toModule);                
            });
            this.requests = [];
            try{
                this.afterSendUndelivered(store);
            }catch{ }
        },

        /** отправка данных */
        sendData(toModule){            
            var itemsAll = this.getSelfItems();
            bus.$emit('responseTo-' + toModule, { from: this.moduleName, key: this.selfItemKey, items: itemsAll })
        },

        /** ОБРАБОТЧИК СОБЫТИЯ: Если у модуля изменились данные и он генерирует сообщение всем - обновите связанные со мной данные */
        onUpdateRestrictionInner(message){
            // проверяем, есть ли у нас вообще зависимости от этого модуля
            var restrictions = this.restrictions[message.from];
            if(isNullOrUndefined(restrictions))
                return

            try{   
                this.beforeUpdateRestriction(message, store)
            }catch{}
            

            var itemsAll = this.getSelfItems();
            if(itemsAll.length==0)
               return;

            if(!isArray(restrictions)){
                restrictions = [ restrictions ];
            }

            restrictions.forEach(restriction=>{
                    var destinationKey = restriction['key']; // название параметра идентификатора source в destination объекте 
                    if(!isNullOrUndefined(destinationKey)){  // может быть кастомная постобработка объектов, если destinationKey === undefined
                        var sourceKey = message.key; // название параметра идентификатора source=
        
                        var sourceKVP = message.items.reduce(function(r, e) {
                            r[e[sourceKey]] = e;
                            return r;
                        }, {});
                        
                        var restrictionKeys = Object.keys(restriction).filter(f=>f!='key')
                        itemsAll.forEach(el => {    
                            var id = getPath(el, destinationKey);  
        
                            var srcItem = sourceKVP[id];
                            if(!isNullOrUndefined(srcItem)){
                                restrictionKeys.forEach(parameter=>{
                                    var srcData = srcItem[parameter];               // значение параметра 
                                    if(!isNullOrUndefined(srcData))
                                    { 
                                        var destParameterName = restriction[parameter]; // параметр назначения
                                        var path = '';
                                        var pItems = destParameterName.split('.')
                                        pItems.forEach((pItem, index, array)=>{
                                            if(index  >= 0 && index < array.length - 1){
                                                let obj = path.length ? el[path] : el;
                                                if(isNullOrUndefined(obj))
                                                    Vue.set(obj, pItem, {}) 
                                                path += index == 0 ? pItem : `.${pItem}`;
                                            }
                                        })
                                        let obj = path.length ? el[path] : el;
                                        destParameterName = path.length ? pItems[pItems.length -1] : destParameterName;
                                        if(isNullOrUndefined(obj[destParameterName]))
                                            Vue.set(obj, destParameterName, srcData)
                                        else
                                            obj[destParameterName] = srcData
                                    }
                                });        
                            }
                        });
                    } //  <--   !isNullOrUndefined(destinationKey)
                }
            )



            if(!isNullOrUndefined(this.onUpdateRestriction))
                try{
                itemsAll = this.onUpdateRestriction(message, itemsAll, store)
                }catch(err)
                {  
                    console.log(err);
                }
            
            this.pushSelfItems(itemsAll);
        },

        getSelfItems(){
            return store.getters[this.moduleName + '_itemsAll'];
        },

        pushSelfItems(data, callback){
            log.debug(data, '_mixin');
            store.dispatch(this.moduleName + '_pushItems', data)
                .then(callback);
        },        
        
        putSelfItem(data, callback){
            log.debug(data, '_mixin');
            store.dispatch(this.moduleName + '_putItem', data)
                .then(callback);
        },

        deleteSelfItem(data, callback){
            log.debug(data, '_mixin');
            store.dispatch(this.moduleName + '_deleteItem', data)
                .then(callback);
        },

        putReactiveState(data){
            log.debug(data, '_mixin');
            store.dispatch(this.moduleName + '_putReactiveState', data)
        },        
        deleteReactiveState(data){
            log.debug(data, '_mixin');
            store.dispatch(this.moduleName + '_deleteReactiveState', data)
        },

        /** СОЗДАНИЕ событий на обновление зависимостей */
        updateSelfRestriction(){
            this.beforeCallRestrictions(this.getSelfItems(), this.pushSelfItems);

            Object.keys(this.restrictions).forEach(toModule => {
                bus.$emit('request-' + toModule, { from: this.moduleName })
            });
        },

        listWasUpdated(){
            log.debug('begin listWasUpdated', '_mixin');
            this.updateSelfRestriction();
            var itemsAll = this.getSelfItems();
            bus.$emit('responseTo-all',  { from: this.moduleName, key: this.selfItemKey, items: itemsAll })
        },

        timeout(ms){
            return new Promise(resolve =>setTimeout(resolve, ms));
        },
   
        websocketUpdateInner(data){
            try
            {
                var self = this;
                var itemsAll = this.getSelfItems();
                var rId = new Date().getUTCMilliseconds();

                if(isNullOrUndefined(data.prep))
                    Vue.set(data, 'prep', {});
        
                this.websocketUpdate(
                    data, 
                    
                    itemsAll, 

                    (item) => {
                        itemsAll.push(item)
                        this.pushSelfItems(itemsAll,
                        r=>{
                            // console.log('pushSelfItems')
                            self.listWasUpdated();
                            self.putReactiveState({ id: item.id, state: 'add', rId })
                            self.timeout(5000).then(t=>self.deleteReactiveState(rId))
                        })
                    },

                    (item) => {
                        this.putSelfItem(item,
                        r=>{
                            // console.log('putSelfItem')
                            self.listWasUpdated();
                            self.putReactiveState({ id: item.id, state: 'edit', rId })
                            self.timeout(3000).then(t=>self.deleteReactiveState(rId))
                        })
                    },                   
                    
                    (item) => {
                        self.putReactiveState({ id: item.id, state: 'delete', rId })
                        self.timeout(3000).then(t=>{
                            self.deleteReactiveState(rId)
                            self.deleteSelfItem(item,
                                r=>{
                                    self.listWasUpdated();
                                })
                            });
                    }, 

                    store
                );
            }
            catch(err)
            {
                log.error(error, '_mixin');
            }
        },

        canLeaveSection(){
            var self = this;
            return new Promise((resolve, reject)=>{
                var editMode = store.getters[this.moduleName + '_editMode'];                
                if (!editMode)
                    return resolve();

                Vue.prototype.$windows.showDialog(
                {
                    dialogCode: 'confirmDialog',
                    props: {
                    textConst    : 'confirmLeave',
                    objArray     : []
                    },
                    onAccept: function(){ 
                        try{self.onLeaveSection(store);} catch{}
                        return resolve();
                    },

                    onCancel: function(){
                        return reject();
                    }
                }
                );
            });
        },
        
        afterEnterSectionInner(){ // вызов ф-ии пока не производится в navigation
            try{
                this.afterEnterSection(store);
            }catch(error){
                log.error(error, '_mixin');
            }
        }
    },

    created(){
        // запрос в модуль на предоставление данных
        bus.$on('request-' + this.moduleName, this.requestData)

        // ответ из другого модудуля для конкретно нашего
        bus.$on('responseTo-' + this.moduleName, this.onUpdateRestrictionInner)

        // ответ из другого для всех (если изменился список и нужно у всех зависимых обновить)
        bus.$on('responseTo-all', this.onUpdateRestrictionInner)

        // запрос из VUEX на обновление своих зависимостей
        bus.$on('update-self-restriction-' + this.moduleName, this.updateSelfRestriction)

        // когда нужно обновить зависимости остальных, прилетает отсюда
        bus.$on('update-other-restriction-' + this.moduleName, this.listWasUpdated)

        // когда прилетел объект по вебсокету
        bus.$on('websocket-message-' + this.moduleName, this.websocketUpdateInner)
    }
}
