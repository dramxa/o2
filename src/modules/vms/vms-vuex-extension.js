import Vue from 'vue'
import mixin from '@/modules/_system/_extension/_mixin'
import { mapGetters, mapActions } from 'vuex';
import { toKeyValuePair } from '@/utilites';
import { vmTaskConsts }   from '@/consts/taskConsts';

const moduleName = 'vm'

const module = new Vue({

    mixins:[mixin],

    data(){ return{
        moduleName,
        selfItemKey: 'id',
        restrictions: { 
            // key - идентификатор source в объекте destination
            // название модуля : { название параметра в источнике : название параметра в получателе }
            'prj'  : { 
                'key' : 'projectId', 
                'name': 'prep.projectName' 
            },

            'grp'  : { 
                'key' : 'groupId'  , 
                'name': 'prep.groupName'   
            },

            'os'   : { 
                'key' : 'osCode', 
                'name': 'prep.osName'
            },

            'lctn' : { 'key'            : 'resourceProfileId',
                       'fullPath'       : 'prep.resourceProfileFullpath',
                       'datacenter'     : 'prep.datacenter',
                       'serviceProvider': 'prep.serviceProvider',
                       'resourceProfile': 'prep.resourceProfile',
                       'isLocked'       : 'prep.isLocationLocked'
                     },

            'tmpl'       : {  },
            'net'        : {  },
            'med'        : {  },
            'prc'        : {  },
            'diskPolicy' : {  }           
        }
    }},
    
    computed:{
        ...mapGetters([moduleName + '_loading', 'glb_impersonatedOrgId']),

        loadingState(){
            return this[moduleName + '_loading'];
        }
    },
    
    methods: {
        ...mapActions(['vm_getSnapshots']),

        beforeCallRestrictions(items, pushFnc){
            // console.log(items)
            items.forEach(item => {
                let storageTotal = Math.round( ((isNullOrUndefined(item.disks) ? 0 : item.disks.map(d=>{return d.size }).reduce((a,b) => a + b, 0)) / 1024 )* 100) / 100;
                let storageTotalFormatted = localeString(storageTotal);

                let ramTotal = Math.round(( item.ram / 1024 )* 100) / 100;
                let ramFormatted = localeString(ramTotal);
                
                // vm_getSnapshots(item.id).then((res)=>{
                //     Vue.set(item.prep, 'snapshots', res)
                // });

                Vue.set(item.prep, 'ramTotal', ramTotal)
                Vue.set(item.prep, 'ramFormatted', ramFormatted)
                Vue.set(item.prep, 'storageTotal', storageTotal)
                Vue.set(item.prep, 'storageTotalFormatted', storageTotalFormatted)
                Vue.set(item.prep, 'createDateFormatted', formatDate(item.createDate))
                item.disks.forEach(disk=>{
                    var size =  Math.round((disk.size / 1024 )* 100) / 100;
                    Vue.set(disk, 'sizeFormatted', localeString(size));
                });

                // работаем со снепшотами
                Vue.set(item.prep, 'snapshots', []);
                if(!isNullOrUndefined(item.snapshots)){
                    item.prep.snapshots = clone(item.snapshots)
                    item.prep.snapshots.forEach(snap=>{
                        Vue.set(snap, 'createDateFormatted', formatDate(snap.createDate))
                        Vue.set(snap, 'children', []);
                        Vue.set(snap, 'isDisable', false)
                    })
                    // строим дерево снепшотов
                    var snapDict = item.prep.snapshots.reduce((r, e)=>{ r[e.id] = e; return r;  }, {});
                    item.prep.snapshots.forEach(snap=>{                            
                        if(isNullOrUndefined(snap.parentId))
                            return;                    
                        snapDict[snap.parentId].children.push(snap)
                    });
                    var snapInUse = item.prep.snapshots.find(w=>w.isInUse)
                    if(!isNullOrUndefined(snapInUse))
                        snapInUse.children.unshift({ id: 201, name: 'You are here', isDisable: true, });
                    // -----------------------
                }

                if(!isNullOrUndefined(item.mediaImageContainers)){      
                    item.mediaImageContainers.forEach(mediaContainer=>{
                        if(isNullOrUndefined(mediaContainer.image))
                        {               
                            Vue.set(mediaContainer, 'image', {})
                            Vue.set(mediaContainer.image, 'id', null);
                        }                        
                    });
                }                
            });  
            pushFnc(items);
        },

        websocketUpdate(wsItem, itemsAll, pushItem, putItem, deleteItem, store) {
            // если по вебсокекету в таске пришла ошибка
            if(!isNullOrUndefined(wsItem.tasks) && wsItem.tasks.length && wsItem.tasks[0].stateCode == 'error'){
                let codeDetails = vmTaskConsts[wsItem.tasks[0].typeCode];
                let msg = { 
                    id         : wsItem.tasks[0].id,
                    type       : 'error', 
                    kind       : 'task',
                    title      : codeDetails.caption + ' error', 
                    caption    : '', 
                    description: codeDetails.errorDescription(wsItem.name), //wsItem.tasks[0].result_descsription, 

                    wasShown : false,  
                    acknowledge: false }
                store.dispatch('msg_pushNewMessage', msg)
                showMessage('serverError', { caption: codeDetails.caption, message:codeDetails.errorDescription(wsItem.name)});// wsItem.tasks[0].result_descsription });
            }

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

        onUpdateRestriction(msg, allItems){
            if(msg.from=='prc')
            {
                var getVmPriceList = function(vm){
                    let vmPrcs = msg.items.filter(f=>f.resourceProfileId == vm.resourceProfileId);
                    if(vmPrcs.length == 0) // если для location вм нет никаких прайсов, выходим
                      return null;
                    let orgPrc = vmPrcs.find(f=>isNullOrUndefined(f.projectId) && isNullOrUndefined(f.groupId));
                    let prjPrc = vmPrcs.find(f=>f.projectId == vm.projectId && isNullOrUndefined(f.groupId));
                    let grpPrc = vmPrcs.find(f=>f.projectId == vm.projectId && f.groupId == vm.groupId);
                    if(!isNullOrUndefined(grpPrc))
                      return grpPrc;
                    if(!isNullOrUndefined(prjPrc))
                      return prjPrc;
                    if(!isNullOrUndefined(orgPrc))
                      return orgPrc;
                    return null; // если прайсы были, но ни один не совпал
                }


                allItems.forEach(item=>{
                    Vue.set(item.prep, 'priceCalcError', false)

                    var prcLst = getVmPriceList(item);

                    // если прайс не найден, переходим к следующей ВМ
                    if(isNullOrUndefined(prcLst))
                    return;
                    
                    var prcSrvList = prcLst.prep.prices;
                    // считаем цену ВМ по CPU RAM и Каждому диску
                    let onlyVmPrice = 0;
                    let vmWithSnapshotsPrice = 0;
                    let snapshotsPrice = 0;

                    let daysInMonth = getDaysInMonth();

                    Vue.set(item.prep, 'prcLstId', prcLst.id);
                    
                    try{
                        onlyVmPrice =  isNullOrUndefined(prcSrvList['cpu']) ? ()=>{ item.prep.priceCalcError = true; return 0 } : prcSrvList['cpu'] * item.cpu;
                        onlyVmPrice += isNullOrUndefined(prcSrvList['ram']) ? ()=>{ item.prep.priceCalcError = true; return 0 } : prcSrvList['ram'] * (item.ram / 1024);
                        item.disks.forEach(disk=>{
                            if(isNullOrUndefined(prcSrvList[disk.policyCode])){
                                item.prep.priceCalcError = true;                                
                            }else
                                onlyVmPrice+= prcSrvList[disk.policyCode] * (disk.size / 1024);
                        })
                        if(item.prep.snapshots.length){
                            item.prep.snapshots.forEach(snap=>{
                                Vue.set(snap, 'prep', {});
                                Vue.set(snap.prep, 'price', {});
                                Vue.set(snap.prep, 'priceFormatted', {});
                                let snapPrice = 0;
                                snap.disks.forEach(disk=>{
                                    if(isNullOrUndefined(prcSrvList[disk.policyCode])){
                                        item.prep.priceCalcError = true;                                
                                    }else
                                        snapshotsPrice += prcSrvList[disk.policyCode] * (disk.size / 1024);
                                        snapPrice += prcSrvList[disk.policyCode] * (disk.size / 1024);
                                });
                                if(snap.isWithMemory){
                                    if(isNullOrUndefined(prcSrvList[snap.policyCodeRam])){
                                        item.prep.priceCalcError = true;                                
                                    }else
                                        snapshotsPrice+= prcSrvList[snap.policyCodeRam] * (snap.sizeRam / 1024);
                                        snapPrice+= prcSrvList[snap.policyCodeRam] * (snap.sizeRam / 1024);
                                }
                                Vue.set(snap.prep.price, 'perHour' , snapPrice);
                                Vue.set(snap.prep.price, 'perDay'  , snapPrice * 24);
                                Vue.set(snap.prep.price, 'perMonth', snapPrice * 24 * daysInMonth);
                                Vue.set(snap.prep.priceFormatted, 'perHour' , localePrice(snapPrice, prcLst.currencyCode));
                                Vue.set(snap.prep.priceFormatted, 'perDay'  , localePrice(snapPrice * 24, prcLst.currencyCode));
                                Vue.set(snap.prep.priceFormatted, 'perMonth', localePrice(snapPrice * 24 * daysInMonth, prcLst.currencyCode));
                            });
                        }

                    }
                    catch{
                        item.prep.priceCalcError = true
                    }

                    vmWithSnapshotsPrice = onlyVmPrice + snapshotsPrice;

                    Vue.set(item.prep, 'priceListCurrency', prcLst.currencyCode);

                    Vue.set(item.prep, 'priceListName', prcLst.name);

                    Vue.set(item.prep, 'priceFullTotal', {
                        'perHour' : vmWithSnapshotsPrice,
                        'perDay'  : vmWithSnapshotsPrice * 24,
                        'perMonth': vmWithSnapshotsPrice * 24 * daysInMonth
                    });
                    Vue.set(item.prep, 'priceFullTotalFormatted', {
                        'perHour' : localePrice(vmWithSnapshotsPrice, prcLst.currencyCode),
                        'perDay'  : localePrice(vmWithSnapshotsPrice * 24, prcLst.currencyCode),
                        'perMonth': localePrice(vmWithSnapshotsPrice * 24 * daysInMonth, prcLst.currencyCode)
                    });

                    Vue.set(item.prep, 'priceOnlyVmTotal', {
                        'perHour' : onlyVmPrice,
                        'perDay'  : onlyVmPrice * 24,
                        'perMonth': onlyVmPrice * 24 * daysInMonth
                    });
                    Vue.set(item.prep, 'priceOnlyVmTotalFormatted', {
                        'perHour' : localePrice(onlyVmPrice, prcLst.currencyCode),
                        'perDay'  : localePrice(onlyVmPrice * 24, prcLst.currencyCode),
                        'perMonth': localePrice(onlyVmPrice * 24 * daysInMonth, prcLst.currencyCode)
                    });

                    Vue.set(item.prep, 'priceSnapTotal', {
                        'perHour' : snapshotsPrice,
                        'perDay'  : snapshotsPrice * 24,
                        'perMonth': snapshotsPrice * 24 * daysInMonth
                    });
                    Vue.set(item.prep, 'priceSnapTotalFormatted', {
                        'perHour' : localePrice(snapshotsPrice, prcLst.currencyCode),
                        'perDay'  : localePrice(snapshotsPrice * 24, prcLst.currencyCode),
                        'perMonth': localePrice(snapshotsPrice * 24 * daysInMonth, prcLst.currencyCode)
                    });           

                    // TODO: проверить, используется ли это где-то
                    Vue.set(item.prep, 'priceTotalFormatted', localePrice(vmWithSnapshotsPrice * 24 * daysInMonth, prcLst.currencyCode));
                    Vue.set(item.prep, 'priceTotal', vmWithSnapshotsPrice * 24 * daysInMonth); 
                    })
            }
            return allItems;
        },

        onLeaveSection(store){
            store.dispatch('vm_setExtEditorState', false);
            store.dispatch('vm_setMonitoringState', false);
            store.dispatch('vm_setShowProperty');
        },

        openConsole(item){
            this.$nav.navigateToNewWindow('/vmwareconsole/?vmId=' + item.id, true);
        }

    }
})
 
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  