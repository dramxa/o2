// модуль производит калькуляцию для проектов
// 1) ставит все запросы в очередь и блокирует до получения данных
// 2) проверяет загружены ли данные у модулей от которых зависит калькуляция, запрашивает их при необходимости
// 3) калькулирует данные и возвращает значения

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { WaitObject } from '@/utilites'
import { currencies } from '@/consts/pricelistConst';

const store = Vue.prototype.$store

const moduleName = 'calcPrjFabric'

const moduleObj = {
    store,

    data(){
        return {
            waiter: null
        }
    },

    computed:{
        ...mapGetters([
            'prc_loading',
            'prc_firstLoad',
            'prc_itemsAll',

            'prj_loading',
            'prj_firstLoad',
            'prj_itemsAll',

            'grp_loading', 
            'grp_firstLoad',
            'grp_itemsAll',

            'vm_loading',
            'vm_firstLoad',
            'vm_itemsAll']),
        
        // проверяем права на прайслисты
        havePrcPermission(){
            return Vue.prototype.$security.havePermission('ft_prcRead')
        },

        // проверяем наличие блокировок (если идет загрузка данных)
        haveLockes(){
            return this.prc_loading || this.prj_loading  || this.grp_loading || this.vm_loading
        }
    },

    watch:{
        // как только все загрузки завершены, разблокирует запросы для дальнейшей работы
        haveLockes(value){
            if(this.waiter != null && !this.waiter.finished && !value)
                this.waiter.unhold();
        }
    },

    methods:{
        ...mapActions([
            'prc_getItems',
            'prj_getItems',
            'grp_getItems',
            'vm_getItems'
        ]),

        // проверяем что данные хоть раз загружались с сервера, если нет, инициируем загрузку
        checkForFirstLoadSources(){            
            if(this.havePrcPermission && this.prc_firstLoad)
                this.prc_getItems();

            if(this.prj_firstLoad)
                this.prj_getItems();

            if(this.grp_firstLoad)
                this.grp_getItems();

            if(this.vm_firstLoad)
                this.vm_getItems();
        },

        getData: async function(){
            var noNeed = false;
            // проверяем есть ли фабрика ожидания, если нет или она уже отработала, создает новую
            if(this.waiter == null || this.waiter.finished){
                this.checkForFirstLoadSources();
                noNeed = !this.haveLockes;
                if(!noNeed)
                  this.waiter = new WaitObject();
            }
            // ждем пока все данные собируться
            if(!noNeed)
              await this.waiter.wait();
            // калькулируем
            return this.calculation();
        },

        calculation(){
            try{  
                var prcs = [];
                
                if(this.havePrcPermission)
                  prcs = this.prc_itemsAll                
            

                prcs.forEach(item=>{
                    item.letter = currencies[item.currencyCode].letter;
                    item.prices = {};
                    item.services.forEach(srvc => {
                      let tempHistArr = srvc.history;
                      tempHistArr.forEach(t => {
                          if(!Number.isInteger(t.dateFrom))
                              t.dateFrom = Date.parse(t.dateFrom);
                      });
                      tempHistArr.sort((a, b) => a.dateFrom < b.dateFrom ? 1 : -1);
                      srvc.history = tempHistArr;
                      Vue.set(srvc)
          
                      let price = tempHistArr.length ? tempHistArr[0].price : 0;
                      Vue.set(item.prices, srvc.serviceCode, price)
                  });
                });
          
                var getVmPriceList = function(vm){
                  let vmPrcs = prcs.filter(f=>f.resourceProfileId == vm.resourceProfileId);
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
          
                var  vms  = this.vm_itemsAll;
                var  grps = this.grp_itemsAll;
                var  prjs = this.prj_itemsAll;
                
                var prjStat = [];
                var daysInMonth = getDaysInMonth();
          
                prjs.forEach(prj=> {
                  var prjVms = vms.filter(f=>f.projectId == prj.id);
                  var stat = {};
          
                  stat['id'] = prj.id;
                  stat.groupCount = grps.filter(f=>f.projectId == prj.id).length;
                  stat.vmCount = prjVms.length;
          
                  stat.error = 0;
                  stat.ready = 0;
                  stat.busy  = 0;
          
                  stat.running   = 0;
                  stat.suspended = 0;
                  stat.stopped   = 0;
          
                  stat.cpu     = 0;
                  stat.ram     = 0;
                  stat.ramFormatted = '0';
          
                  stat.storage = 0;
          
                  stat.storageTypes = { };
          
                  stat.prices = { }
          
                  prjVms.forEach(vm=>{
                    stat[vm.statusCode]++;
                    stat[vm.powerStateCode]++;
                    stat.statuses = [];
                    if(stat.error > 0)
                      stat.statuses.push('error')
                    if(stat.ready > 0)
                      stat.statuses.push('ready')
                    if(stat.busy > 0)
                      stat.statuses.push('busy')
                    
                    stat.cpu += vm.cpu;
                    stat.ram += vm.ram;
                    stat.ramFormatted = stat.ram > 0 ? localeString(  Math.round(stat.ram / 1024 * 100) / 100 ) : '0';
                    if(vm.disks.length > 0){
                      stat.storage += vm.disks.map(d=>{return d.size }).reduce((a,b) => a + b, 0);
                      vm.disks.forEach(disk=>{
                        if(isNullOrUndefined(stat.storageTypes[disk.policyCode]))
                          stat.storageTypes[disk.policyCode] = disk.size;
                        else
                          stat.storageTypes[disk.policyCode] += disk.size;
                      })
                    }
                    // рассчет цен
                    var vmPrc = getVmPriceList(vm)     
                    var hasPrice = !isNullOrUndefined(vmPrc);
                    if(!hasPrice)
                      return;
                    
                    let currCode = vmPrc.currencyCode;
                    if(isNullOrUndefined(stat.prices[currCode])){
                      stat.prices[currCode] = {};
                      stat.prices[currCode].snapPrice = { perHour: 0,  perDay: 0, perMonth: 0 }  
                      stat.prices[currCode].onlyVmPrice = { perHour: 0,  perDay: 0, perMonth: 0 }
                      stat.prices[currCode].price         = 0;
                      stat.prices[currCode].pricePerHour  = 0;
                      stat.prices[currCode].pricePerDay   = 0;
                      stat.prices[currCode].pricePerMonth = 0;  
                      stat.prices[currCode].onlyVmPriceFormatted = { }  
                      stat.prices[currCode].snapPriceFormatted = {  }
                    }
          
                    var price = 0;
                    var snapPrice = 0;
                    if(hasPrice){
                      // console.log(vm.name, vm)
                      price = vmPrc.prices['cpu'] * vm.cpu;
                      price += vmPrc.prices['ram'] * (vm.ram / 1024);
                      vm.disks.forEach(disk=>{ price+= vmPrc.prices[disk.policyCode] * (disk.size / 1024); });
          
                      if(!isNullOrUndefined(vm.snapshots) && vm.snapshots.length){
                        vm.snapshots.forEach(snap=>{
                            snap.disks.forEach( disk=>{ snapPrice += vmPrc.prices[disk.policyCode] * (disk.size / 1024); });
                            snapPrice+= !snap.isWithMemory ? 0 : vmPrc.prices[snap.policyCodeRam] * (snap.sizeRam / 1024);              
                        });
                      }          
                    }
                    stat.prices[currCode].onlyVmPrice.perHour  += price;
                    stat.prices[currCode].onlyVmPrice.perDay   += price * 24;
                    stat.prices[currCode].onlyVmPrice.perMonth += price * 24 * daysInMonth;
          
                    stat.prices[currCode].snapPrice.perHour  += snapPrice;
                    stat.prices[currCode].snapPrice.perDay   += snapPrice * 24;
                    stat.prices[currCode].snapPrice.perMonth += snapPrice * 24 * daysInMonth;
                    
                    stat.prices[currCode].price += price + snapPrice;
                    stat.prices[currCode].pricePerHour  += price + snapPrice;
                    stat.prices[currCode].pricePerDay   += (price + snapPrice) * 24;
                    stat.prices[currCode].pricePerMonth += (price + snapPrice) * 24 * daysInMonth;
          
          
                    stat.prices[currCode].onlyVmPriceFormatted.perHour  = localePrice(stat.prices[currCode].onlyVmPrice.perHour , currCode);
                    stat.prices[currCode].onlyVmPriceFormatted.perDay   = localePrice(stat.prices[currCode].onlyVmPrice.perDay  , currCode);
                    stat.prices[currCode].onlyVmPriceFormatted.perMonth = localePrice(stat.prices[currCode].onlyVmPrice.perMonth, currCode);
          
                    stat.prices[currCode].snapPriceFormatted.perHour  = localePrice(stat.prices[currCode].snapPrice.perHour , currCode);
                    stat.prices[currCode].snapPriceFormatted.perDay   = localePrice(stat.prices[currCode].snapPrice.perDay  , currCode);
                    stat.prices[currCode].snapPriceFormatted.perMonth = localePrice(stat.prices[currCode].snapPrice.perMonth, currCode);
                    /* snap */
                    stat.prices[currCode].priceTotalFormatted = localePrice(stat.prices[currCode].price, currCode);
                    stat.prices[currCode].priceTotalPerHourFormatted  = localePrice(stat.prices[currCode].pricePerHour , currCode);
                    stat.prices[currCode].priceTotalPerDayFormatted   = localePrice(stat.prices[currCode].pricePerDay  , currCode);
                    stat.prices[currCode].priceTotalPerMonthFormatted = localePrice(stat.prices[currCode].pricePerMonth, currCode);
          
                  })
                  prjStat.push(stat);
                })
                return prjStat;          
              } 
            catch (error) {
              console.error(error)
            }
            throw "Have some errors in calculation" 
        }
    }

}

export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = new Vue(moduleObj);
}
  