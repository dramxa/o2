import dataScripts from './_groups-dataScripts'

import complete    from './groups-complete-guide'
import toolbar     from './groups-toolbar-guide'
import filter      from './groups-filter-guide'
import dataTable   from './groups-dataTable-guide'
import property    from './groups-property-guide'
import create      from './groups-create-guide'
import edit        from './groups-edit-guide'
import del         from './groups-delete-guide'

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