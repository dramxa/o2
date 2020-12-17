import dataScripts from './_pricelists-dataScripts'

import complete    from './pricelists-complete-guide'
import toolbar     from './pricelists-toolbar-guide'
import filter      from './pricelists-filter-guide'
import dataTable   from './pricelists-dataTable-guide'
import property    from './pricelists-property-guide'
import create      from './pricelists-create-guide'
import edit        from './pricelists-edit-guide'
import del         from './pricelists-delete-guide'

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