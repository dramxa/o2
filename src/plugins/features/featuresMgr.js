import Vue from 'vue'
import {register as registerFeaturesDialog}  from './featuresDialog'
import unstableFeatures from './unstableFeatures'
import allFeatures from './allFeatures'
import featuresVuexModule from './features-vuex'
import { mapGetters, mapActions } from 'vuex';

const store = Vue.prototype.$store
const moduleName = 'features'
var isNullOrUndefined = (value) => value === null || value === undefined;

const moduleObj = new Vue({
  store,

  methods:{
    ...mapActions(['features_setData', 'features_setUnreachable']),

    computedFeatures : async function(){
      // здесь апи реквест к серверу
      var srvUnstableFeatures = []  // [ { code: '',  enable: false } ]
      try{
        throw 'temporary'
        srvUnstableFeatures = await Vue.prototype.$api.getItems('v1.0/features/')
        this.features_setUnreachable(false);
      }catch{
        this.features_setUnreachable(true);
      }


      // формируем список фич для исключения
      var uFeatures = [];

      if(!stand.isDevelop)
        uFeatures = unstableFeatures.reduce((r, e)=>{
          let srvItem = srvUnstableFeatures.find(f=>f.code == e.code);
          if(isNullOrUndefined(srvItem)){  // если не нашли в списке с сервера, то используем дефолты
            if(!e.enable || e.hiddenOnProd)  
              r.push(...e.features)
          } else if(!srvItem.enable) {
            r.push(...e.features)
          }
          return r;
        }, []);

      var srvCompare = clone(unstableFeatures);
      srvCompare.forEach(item=>{
        var srvItem = srvUnstableFeatures.find(f=>f.code == item.code)
        if(srvItem != null)
          item.enable = srvItem.enable;
      })
      this.features_setData(srvCompare);

      // формируем список всех разрешенных фич
      var res = allFeatures.reduce((r,e)=>{
        if(!uFeatures.some(k=>k == e.code))
          r.push(e)
        return r;
      }, [])

      return res;
    } 
  }

});

export default function(){
    registerFeaturesDialog();
    store.registerModule(moduleName, featuresVuexModule);
    let key = `$${moduleName}`;
    Vue.prototype[key] = moduleObj;
  }