import dataScripts from './_ds-dataScripts'

import complete    from './ds-complete-guide'
import toolbar     from './ds-toolbar-guide'
import filter      from './ds-filter-guide'
import dataTable   from './ds-dataTable-guide'
import property    from './ds-property-guide'
import create      from './ds-create-guide'
import edit        from './ds-edit-guide'
import del         from './ds-delete-guide'

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