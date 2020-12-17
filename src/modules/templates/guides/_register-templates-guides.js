import dataScripts from './_templates-dataScripts'

import complete    from './templates-complete-guide'
import toolbar     from './templates-toolbar-guide'
import filter      from './templates-filter-guide'
import dataTable   from './templates-dataTable-guide'
import property    from './templates-property-guide'
import create      from './templates-create-guide'
import edit        from './templates-edit-guide'
import del         from './templates-delete-guide'

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