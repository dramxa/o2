import dataScripts from './_networks-dataScripts'

import complete    from './networks-complete-guide'
import toolbar     from './networks-toolbar-guide'
import filter      from './networks-filter-guide'
import dataTable   from './networks-dataTable-guide'
import property    from './networks-property-guide'
import create      from './networks-create-guide'
import edit        from './networks-edit-guide'
import del         from './networks-delete-guide'

import Vue from 'vue'

export default {
   ...complete  ,
   ...toolbar   ,
   ...filter    ,
   ...dataTable ,
   ...property  ,
   ...create    ,
   ...edit      ,
   ...del       
}

export function initScripts(){
    Vue.prototype.$guide.addDataScripts(dataScripts.moduleCode, dataScripts.functions);
}