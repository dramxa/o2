import dataScripts from './_roles-dataScripts'

import complete    from './roles-complete-guide'
import toolbar     from './roles-toolbar-guide'
import filter      from './roles-filter-guide'
import dataTable   from './roles-dataTable-guide'
import property    from './roles-property-guide'
import create      from './roles-create-guide'
import edit        from './roles-edit-guide'
import del         from './roles-delete-guide'

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