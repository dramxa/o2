import dataScripts from './_dst-dataScripts'

import complete    from './dst-complete-guide'
import toolbar     from './dst-toolbar-guide'
import filter      from './dst-filter-guide'
import dataTable   from './dst-dataTable-guide'
import property    from './dst-property-guide'
import create      from './dst-create-guide'
import edit        from './dst-edit-guide'
import del         from './dst-delete-guide'

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