import dataScripts from './_limits-dataScripts'

import complete    from './limits-complete-guide'
import toolbar     from './limits-toolbar-guide'
import filter      from './limits-filter-guide'
import dataTable   from './limits-dataTable-guide'
import property    from './limits-property-guide'
import create      from './limits-create-guide'
import edit        from './limits-edit-guide'
import del         from './limits-delete-guide'

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