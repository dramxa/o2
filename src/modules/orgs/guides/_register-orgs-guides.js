import dataScripts from './_orgs-dataScripts'

import complete    from './orgs-complete-guide'
import toolbar     from './orgs-toolbar-guide'
import filter      from './orgs-filter-guide'
import dataTable   from './orgs-dataTable-guide'
import property    from './orgs-property-guide'
import create      from './orgs-create-guide'
import edit        from './orgs-edit-guide'
import del         from './orgs-delete-guide'

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