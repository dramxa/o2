import dataScripts from './_media-dataScripts'

import complete    from './media-complete-guide'
import toolbar     from './media-toolbar-guide'
import filter      from './media-filter-guide'
import dataTable   from './media-dataTable-guide'
import property    from './media-property-guide'
import create      from './media-create-guide'
import edit        from './media-edit-guide'
import del         from './media-delete-guide'
import imprt       from './media-dlg-import'

import Vue from 'vue'

export default {
    ...complete  ,
    ...toolbar   ,
    ...filter    ,
    ...dataTable ,
    ...property  ,
    ...create    ,
    ...edit      ,
    ...del       ,
    ...imprt     ,
}

export function initScripts(){
    Vue.prototype.$guide.addDataScripts(dataScripts.moduleCode, dataScripts.functions);
}