import Vue from 'vue';
import extBus from '@/modules/_system/_extension/_bus'
import { toKeyValuePair } from '@/utilites';
import { currencies, currenciesCode } from '@/consts/pricelistConst';

const api_url_prcsItems  = function(postfix)  { return "v1.0/pricelists/" + postfix;  };
const api_url_vmItems    = function(postfix)  { return "v1.0/vms/" + postfix;  };
const api_url_grpItems   = function(postfix)  { return "v1.0/groups/" + postfix;  };
const api_url_prjItems   = function(postfix)  { return "v1.0/projects/" + postfix;  };

const moduleCode = 'calcPrj'

const state = {
  _firstLoad        : true,
  _calcPrj_prjStat  : [],    
  _calcPrj_loading  : false 
}

const getters = {
  calcPrj_firstLoad : state => state._firstLoad,
  calcPrj_itemsAll  : state => state._calcPrj_prjStat,
  calcPrj_loading   : state => state._calcPrj_loading
}


const emptyObject ={
  groupCount  : 0,
  vmCount     : 0,

  error  : 0,
  busy   : 0,
  ready  : 0,

  running   : 0,
  suspended : 0,
  stopped   : 0,

  cpu    : 0,
  ram    : 0,
  storage: 0,

  projectId : null,

  priceListId   : null,
  priceListName : '-',

  price: 0,
  pricePerHour  : 0,
  pricePerDay   : 0,
  pricePerMonth : 0
}


const actions = {
  // получение объектов с сервера
  calcPrj_getItems: async ({commit, getters}) => {
    if(getters.calcPrj_loading)  
    return;

    commit("CALCPRJ_SET_LOADING_STATE", true);
    try {
      var prcs = [];
      
      if(Vue.prototype.$security.havePermission('ft_prcRead')){
        prcs = await Vue.prototype.$api.getItems(api_url_prcsItems(''));
      }

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

      var  vms  = await Vue.prototype.$api.getItems(api_url_vmItems('')) ;
      var  grps = await Vue.prototype.$api.getItems(api_url_grpItems(''));
      var  prjs = await Vue.prototype.$api.getItems(api_url_prjItems(''));
      
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

      commit('CALCPRJ_PUSH_DATA', { prjStat});      
    } catch (error) {
      
    }
        
    // extBus.$emit('update-self-restriction-' + moduleCode);
    commit("CALCPRJ_SET_LOADING_STATE", false);
  },

  calcPrj_clearData: async ({commit}) => {
    commit('CALCPRJ_PUSH_DATA', { prjStat: []});
  },

  calcPrj_pushItems: function(){}
}

const mutations = {
  CALCPRJ_PUSH_DATA (state, { prjStat}){
      state._calcPrj_prjStat  = prjStat;
  },
  
  CALCPRJ_SET_LOADING_STATE (state, value) {
    state._calcPrj_loading = value;
  },
}

const moduleSections = {
    state,
    getters,
    actions,
    mutations
  }

export default moduleSections
    